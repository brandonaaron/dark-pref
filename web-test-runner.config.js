/* eslint-env node */
import { fileURLToPath } from 'node:url'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { playwrightLauncher } from '@web/test-runner-playwright'
import { defaultReporter, summaryReporter } from '@web/test-runner'

const port = 8889

// Setup `browsers` config so we test all permutations of product * colorScheme * stored user preference
const products = ['chromium', 'firefox', 'webkit']
const colorSchemes = ['light', 'dark']
const localStorageInitialValues = [null, 'n', 'y']
const browsers = []
products.forEach((product) => {
  colorSchemes.forEach((colorScheme) => {
    localStorageInitialValues.forEach((value) => {
      browsers.push(playwrightLauncher({
        product,
        createBrowserContext({ browser }) {
          return browser.newContext({
            colorScheme,
            storageState: !value ? undefined : {
              cookies: [],
              origins: [{
                origin: `http://localhost:${port}`,
                localStorage: [
                  { name: '__dark-pref__', value },
                  { name: 'initialDarkPrefValue', value }, // used for test reporting
                ],
              }],
            },
          })
        },
      }))
    })
  })
})

export default {
  browsers,
  middleware: [
    // rewrite .js extensions to .ts extensions from import statements
    function rewriteJSToTS(context, next) {
      if (/\/src\/.+.js/.test(context.url)) {
        context.url = context.url.replace('.js', '.ts')
      }
      return next()
    },
  ],
  nodeResolve: true,
  plugins: [esbuildPlugin({
    // use typescript esbuild loader for all js and ts files
    loaders: { '.js': 'ts', '.ts': 'ts' },
    tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
  })],
  port,
  reporters: [defaultReporter(), summaryReporter()],
  testRunnerHtml: testFramework => `
    <!doctype html>
    <html>
      <head>
        <script src="./src/DarkPref.blocking.js"></script>
      </head>
      <body>
        <div id="fixture">
          <dark-pref-toggle id="default"></dark-pref-toggle>
          <dark-pref-toggle id="slots">
            <div slot="light">light</div>
            <div slot="dark">dark</div>
          </dark-pref-toggle>
        </div>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
}
