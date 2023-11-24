/* eslint-env mocha */
import { assert } from 'chai'
import { DarkPref, DarkPrefCurrentState, DarkPrefUserSetting } from './DarkPref.js'

const darkModeQuery = matchMedia('(prefers-color-scheme: dark)')
const testDarkMode = darkModeQuery.matches
const storedUserPref: string | null = localStorage.getItem('__dark-pref__')
const testUserPref: DarkPrefUserSetting = storedUserPref !== null ? (storedUserPref === 'y') : null
const initialDarkPrefValue: string | null = localStorage.getItem('initialDarkPrefValue')
const initialUserPref: DarkPrefUserSetting = initialDarkPrefValue !== null ? (initialDarkPrefValue === 'y') : null

const reset = () => { DarkPref.toggle(testUserPref) }

describe(`DarkPref (system: ${testDarkMode ? 'dark' : 'light'}, user: ${initialUserPref === null ? 'no-preference' : (initialUserPref ? 'dark' : 'light')})`, function () {
  // each unit test is run as if the browser just started up with the system/user prefs
  afterEach(() => { reset() })

  if (initialUserPref === testDarkMode) {
    it('should null out user pref if it matches system', function () {
      assert.strictEqual(DarkPref.current.user, null)
    })
  }

  it('has a valid current state initially', function () {
    assert.strictEqual(DarkPref.current.system, testDarkMode, 'system should match system')
    assert.strictEqual(DarkPref.current.user, testUserPref, `user should match localStorage (${storedUserPref}) or null`)
    assert.strictEqual(DarkPref.current.isDark, testUserPref ?? testDarkMode, 'isDark should match user pref or fallback to system')
  })

  it('has the correct documentElement className', function () {
    assert.strictEqual(document.documentElement.classList.contains('dark'), testUserPref ?? testDarkMode)
    DarkPref.toggle(!(testUserPref ?? testDarkMode))
    assert.strictEqual(document.documentElement.classList.contains('dark'), !(testUserPref ?? testDarkMode))
  })

  it('triggers the darkpref:sync event', function (done) {
    const handleSync = function ({ detail: current }:CustomEvent<DarkPrefCurrentState>) {
      assert.strictEqual(!testDarkMode, current.isDark, 'it has the correct isDark value')
      document.removeEventListener('darkpref:sync', handleSync)
      done()
    }
    document.addEventListener('darkpref:sync', handleSync)
    DarkPref.toggle(!testDarkMode)
  })

  it('uses local storage as expected', function () {
    DarkPref.toggle(!testDarkMode) // switch into whatever the opposite the system is currently in
    assert.strictEqual(DarkPref.current.system, testDarkMode, 'system value is correct')
    assert.strictEqual(DarkPref.current.user, !testDarkMode, 'user value is correct')
    assert.strictEqual(DarkPref.current.isDark, !testDarkMode, 'cacluated value is correct')
    assert.strictEqual(localStorage.getItem('__dark-pref__'), !testDarkMode ? 'y' : 'n', 'local storage value is correct')

    DarkPref.toggle() // switch back into whatever the system was in
    assert.strictEqual(DarkPref.current.system, testDarkMode, 'system value is correct')
    let expectedUserValue
    if (testDarkMode) {
      if (DarkPref.current.isDark) { expectedUserValue = null }
      else { expectedUserValue = false }
    } else {
      if (DarkPref.current.isDark) { expectedUserValue = true }
      else { expectedUserValue = null }
    }
    assert.strictEqual(DarkPref.current.user, expectedUserValue, 'user value is correct') // user pref drops back to null when it matches system pref
    assert.strictEqual(DarkPref.current.isDark, testDarkMode, 'cacluated value is correct')
    assert.strictEqual(localStorage.getItem('__dark-pref__'), expectedUserValue === null ? null : expectedUserValue ? 'y' : 'n', 'local storage value is correct') // removes key when matching system pref
  })
})
