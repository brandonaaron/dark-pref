/* eslint-env mocha */
import { assert } from 'chai'
import { DarkPref, DarkPrefUserSetting } from './DarkPref.js'
import { DarkPrefToggleElement } from './DarkPrefToggleElement.js'
import { sendMouse, resetMouse, sendKeys } from '@web/test-runner-commands'

const darkModeQuery = matchMedia('(prefers-color-scheme: dark)')
const testDarkMode = darkModeQuery.matches
const storedUserPref: string | null = localStorage.getItem('__dark-pref__')
const testUserPref: DarkPrefUserSetting = storedUserPref !== null ? (storedUserPref === 'y') : null
const initialDarkPrefValue: string | null = localStorage.getItem('initialDarkPrefValue')
const initialUserPref: DarkPrefUserSetting = initialDarkPrefValue !== null ? (initialDarkPrefValue === 'y') : null

const reset = () => { DarkPref.toggle(testUserPref) }

describe(`DarkPrefToggleElement (system: ${testDarkMode ? 'dark' : 'light'}, user: ${initialUserPref === null ? 'no-preference' : (initialUserPref ? 'dark' : 'light')})`, function () {
  // each unit test is run as if the browser just started up with the system/user prefs
  afterEach(() => { reset() })

  it('registered', function () {
    assert.strictEqual(customElements.get('dark-pref-toggle'), DarkPrefToggleElement)
  })

  it('has a valid aria-pressed attribute', function () {
    const darkPrefToggle = document.getElementById('default') as DarkPrefToggleElement | null
    const button = darkPrefToggle?.shadowRoot?.querySelector('button') as HTMLButtonElement | null

    assert.strictEqual(button?.getAttribute('aria-pressed'), testUserPref !== null ? 'true' : 'false', 'initial state is correct')
    darkPrefToggle?.toggle()
    assert.strictEqual(button?.getAttribute('aria-pressed'), testUserPref !== null ? 'false' : 'true', 'toggled state is pressed')
  })

  it('has a valid aria-label attribute', function () {
    const darkPrefToggle = document.getElementById('default') as DarkPrefToggleElement | null
    const button = darkPrefToggle?.shadowRoot?.querySelector('button') as HTMLButtonElement | null

    assert.strictEqual(button?.getAttribute('aria-label'), `${testUserPref !== null ? '' : 'auto '}${(testUserPref ?? testDarkMode) ? 'dark' : 'light'}`, 'initial state is auto')
    darkPrefToggle?.toggle()
    assert.strictEqual(button?.getAttribute('aria-label'), `${testUserPref !== null ? 'auto ' : ''}${(testUserPref ?? testDarkMode) ? 'light' : 'dark'}`, 'toggled state is not auto')
  })

  it('uses has slots for "light" and "dark"', function () {
    const darkPrefToggle = document.getElementById('slots') as DarkPrefToggleElement | null
    const button = darkPrefToggle?.shadowRoot?.querySelector('button') as HTMLButtonElement | null
    const lightSlot = button?.querySelector('slot[name=light]') as HTMLSlotElement | null
    const darkSlot = button?.querySelector('slot[name=dark]') as HTMLSlotElement | null
    const lightElem = lightSlot?.assignedNodes()[0] as HTMLDivElement | null
    const darkElem = darkSlot?.assignedNodes()[0] as HTMLDivElement | null

    assert.strictEqual(lightElem?.textContent, 'light')
    assert.strictEqual(darkElem?.textContent, 'dark')
  })

  it('toggles DarkPref when clicked', async function () {
    await resetMouse()
    const darkPrefToggle = document.getElementById('default') as DarkPrefToggleElement | null
    const button = darkPrefToggle?.shadowRoot?.querySelector('button') as HTMLButtonElement | null
    if (!button) { throw new Error('no button') }
    const { x, y } = button.getBoundingClientRect()
    assert.strictEqual(DarkPref.current.isDark, (testUserPref ?? testDarkMode), 'initial dark pref matches system')
    await sendMouse({ type: 'click', position: [x + 1, y + 1] })
    assert.strictEqual(DarkPref.current.isDark, !(testUserPref ?? testDarkMode), 'dark pref was toggled')
  })

  it('toggles DarkPref when focused and enter key is pressed', async function () {
    const darkPrefToggle = document.getElementById('default') as DarkPrefToggleElement | null
    const button = darkPrefToggle?.shadowRoot?.querySelector('button') as HTMLButtonElement | null
    if (!button) { throw new Error('no button') }
    button.focus()
    assert.strictEqual(DarkPref.current.isDark, (testUserPref ?? testDarkMode), 'initial dark pref matches user/system')
    await sendKeys({ press: 'Enter' })
    assert.strictEqual(!DarkPref.current.isDark, (testUserPref ?? testDarkMode), 'dark pref was toggled')
    await sendKeys({ press: 'Enter' })
    assert.strictEqual(DarkPref.current.isDark, (testUserPref ?? testDarkMode), 'dark pref was toggled again')
  })
})
