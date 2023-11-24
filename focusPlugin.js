// A plugin for web-test-runner to send a focus command
// import { TestRunnerPlugin } from '@web/test-runner-core'
// import type { PlaywrightLauncher } from "@web/test-runner-playwright"

export function focusPlugin ()/*: TestRunnerPlugin*/ {
  return {
    name: 'focus',

    async executeCommand({ command, payload, session }) {
      if (command !== 'focus') { return undefined }
      if (session.browser.type !== 'playwright') { throw new Error('Not supported') }
      if (!payload) { throw new Error('A selector is required') }

      const page = (session.browser /*as PlaywrightLauncher*/).getPage(session.id)
      await page.locator(payload).focus()

      return true
    }
  }
}
