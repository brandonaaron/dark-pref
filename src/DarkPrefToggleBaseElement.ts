import { DarkPref, DarkPrefUserSetting } from './DarkPref.js'

/**
 * Provides some helpers and automatic registration of relevant event handlers.
 *
 * The `sync` method must be implemented. This method is called when the `DarkPref` manager emits the `darkpref:change` event.
 *
 * This does not register a tag.
 */
export class DarkPrefToggleBaseElement extends HTMLElement {
  #darkPrefSyncHandler: EventListener | undefined
  #clickHandler: EventListener | undefined

  connectedCallback () {
    this.addListenerForDarkPrefSync()
    this.addListenerForClick()
  }

  disconnectedCallback () {
    this.removeListenerForDarkPrefSync()
    this.removeListenerForClick()
  }

  sync () {
    throw new Error('sync is not implemented')
  }

  toggle (forceDarkPref?: DarkPrefUserSetting) {
    DarkPref.toggle(forceDarkPref)
  }

  addListenerForClick () {
    if (!this.#clickHandler) {
      this.#clickHandler = () => { this.toggle() }
    }
    this.addEventListener('click', this.#clickHandler)
  }

  removeListenerForClick () {
    if (this.#clickHandler) {
      this.removeEventListener('click', this.#clickHandler)
    }
  }

  addListenerForDarkPrefSync () {
    if (!this.#darkPrefSyncHandler) {
      this.#darkPrefSyncHandler = () => { this.sync() }
    }
    document.addEventListener('darkpref:sync', this.#darkPrefSyncHandler)
  }

  removeListenerForDarkPrefSync () {
    if (this.#darkPrefSyncHandler) {
      document.addEventListener('darkpref:sync', this.#darkPrefSyncHandler)
    }
  }

  /**
   * The buttons is considered pressed if the user preference is not `null`.
   */
  get ariaPressedForCurrentState () {
    return DarkPref.current.user === null ? 'false' : 'true'
  }

  /**
   * Includes the prefix "auto" unless the user has a preference set.
   */
  get ariaLabelForCurrentState () {
    const { isDark, user } = DarkPref.current
    return `${user === null ? 'auto ' : ''}${isDark ? 'dark' : 'light'}`
  }
}
