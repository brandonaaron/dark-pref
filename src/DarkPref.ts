declare global {
  interface DocumentEventMap { 'darkpref:sync': CustomEvent<DarkPrefCurrentState> }
}

export interface DarkPrefCurrentState {
  user: DarkPrefUserSetting
  system: boolean
  isDark: boolean
}
export type DarkPrefUserSetting = boolean | null

const key = '__dark-pref__'
const mediaQuery: MediaQueryList = matchMedia('(prefers-color-scheme: dark)')

let system: boolean = mediaQuery.matches
let user: DarkPrefUserSetting = null
try {
  const stored = localStorage.getItem(key)
  if (stored) { user = stored === 'y' }
  if (stored === user) {
    user = null
    localStorage.removeItem(key)
  }
} catch {} // eslint-disable-line no-empty
let isDark: boolean = user ?? system

// Toggle the 'dark' class immediately
document.documentElement.classList.toggle('dark', isDark)

const DarkPref = {
  /**
   * Used to sync up the current state with the system and user preferences.
   * Always emits a `darkpref:sync` event on the `document`.
   */
  sync () {
    system = mediaQuery.matches
    isDark = user ?? system
    document.dispatchEvent(new CustomEvent<DarkPrefCurrentState>('darkpref:sync', { detail: { user, system, isDark } }))
    document.documentElement.classList.toggle('dark', isDark)
  },

  /**
   * Provides a way to change the user preference.
   * Optionally takes a `DarkPrefUserSetting` to use instead of just toggling.
   * When the user preference is aligned with the system preference,
   * the user preference is set to `null`.
   */
  toggle (pref?: DarkPrefUserSetting) {
    user = typeof pref === 'undefined'
      ? (system ? (isDark ? false : null) : (isDark ? null : true))
      : pref

    try { user === null ? localStorage.removeItem(key) : localStorage.setItem(key, user ? 'y' : 'n') } catch {} // eslint-disable-line no-empty

    DarkPref.sync()
  },

  /**
   * Clears out any user preference and syncs.
   */
  reset () {
    user = null
    try { localStorage.removeItem(key) } catch {} // eslint-disable-line no-empty
    DarkPref.sync()
  },

  /**
   * The current user, system, and computed (`isDark`) state.
   * If `user` is `null` then there is no user preference (or the user
   * preference is aligned with the system preference).
   */
  get current () { return { user, system, isDark } }
}

// Keep multiple tabs/windows in sync via the localStorage `storage` event.
addEventListener('storage', (event: StorageEvent) => {
  if (event.key !== key) { return }
  user = event.newValue === 'y' ? true : event.newValue === 'n' ? false : null
  DarkPref.sync()
})

// System preference changes take priority over user preferences.
mediaQuery.addEventListener('change', () => { DarkPref.reset() })

export { DarkPref }
