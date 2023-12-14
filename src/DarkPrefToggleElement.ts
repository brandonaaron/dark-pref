import { DarkPref } from './DarkPref.js'
import { DarkPrefToggleBaseElement } from './DarkPrefToggleBaseElement.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
    button {
      margin: 0;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      line-height: 0;
    }
    button:not(.dark) slot[name="dark"] { display: none; }
    button.dark slot[name="light"] { display: none; }
    button:not(.dark) { color: var(--dark-pref-when-light-color, #000) }
    button.dark { color: var(--dark-pref-when-dark-color, #fff) }
</style>
<button title="Toggles light & dark mode" aria-label="auto" aria-live="polite">
  <slot name='light'>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  </slot>
  <slot name='dark'>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </slot>
</button>
`

/**
 * @slot light - Defaults to a sun svg icon
 * @slot dark - Defaults to a moon svg icon
 *
 * @cssprop [--dark-pref-when-dark-color=#fff] - Controls the `color` when dark is preferred (which applies to the stroke of the default svgs)
 * @cssprop [--dark-pref-when-light-color=#000] - Controls the `color` when light is preferred (which applies to the stroke of the default svgs)
 *
 * @tagname dark-pref-toggle
 */
export class DarkPrefToggleElement extends DarkPrefToggleBaseElement {
  #button: HTMLButtonElement | null | undefined

  connectedCallback() {
    super.connectedCallback()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.#button = shadowRoot.querySelector('button')

    this.sync()
  }

  /**
   * Syncs up with the `DarkPref.currentState`
   */
  sync() {
    this.#button?.classList.toggle('dark', DarkPref.current.isDark)
    this.#button?.setAttribute('aria-pressed', this.ariaPressedForCurrentState)
    this.#button?.setAttribute('aria-label', this.ariaLabelForCurrentState)
  }
}

customElements.define('dark-pref-toggle', DarkPrefToggleElement)
