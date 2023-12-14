// Minimal script for toggling the 'dark' class on the html element

import { DarkPrefUserSetting } from './DarkPref'

const key = '__dark-pref__'
const system = matchMedia('(prefers-color-scheme: dark)').matches
let user: DarkPrefUserSetting = null
try {
  const stored = localStorage.getItem(key)
  if (stored) { user = stored === 'y' }
  if (system === user) {
    user = null
    localStorage.removeItem(key)
  }
} catch {} // eslint-disable-line no-empty
document.documentElement.classList.toggle('dark', user ?? system)
