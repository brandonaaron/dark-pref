# Dark Pref

Provides a preference manager (`DarkPref`), an optional web component (`DarkPrefToggleElement`), an optional base web component (`DarkPrefToggleBaseElement`), and a tiny render blocking script to avoid a potential initial flash of content.

* No dependencies, ES Modules, TypeScript, Unit Tests
* Persists to `localStorage` if possible (uses `__dark-pref__` key)
* Keeps multiple tabs in sync via `localStorage`
* Provides information on system preference and user preference
* Prioritizes the system dark mode preference
* Emits a `darkpref:sync` custom event on the document with current state as the `detail`
* `dark` class name toggled on `<html>` element

See how it works on my [personal site](https://meh.pub) (it is in the top right corner). [Details below](#usage-with-astro) about how I implemented it in Astro.

## Quick Start

Add this to the `<head>`:

```html
<!-- tiny render blocking script to avoid flash of content -->
<script src="https://cdn.jsdelivr.net/npm/@brandonaaron/dark-pref@1.0.0/dist/DarkPref.blocking.js"></script>
<!-- rest of the exports could be bundled with your favorite bundler too -->
<script src="https://cdn.jsdelivr.net/npm/@brandonaaron/dark-pref@1.0.0/dist/DarkPrefToggleElement.js" type="module"></script>
<style>
  :root { /* optional css variables */
    --dark-pref-when-light-color: #999; /* defaults to #000 */
    --dark-pref-when-dark-color: #ccc; /* defaults to #fff */
  }
</style>
```

Then add the included custom element to the `<body>`:

```html
<dark-pref-toggle>
  <!-- Optional slots "light" and "dark" (they default to a sun and moon svg) -->
  <span slot="light">Switch to dark mode</span>
  <span slot="dark">Switch to light mode</span>
</dark-pref-toggle>
```

Check the `examples` folder for other uses like creating your own custom element or not using custom elements at all.

## Docs: DarkPref

### DarkPref.current

A getter that includes three props: `system` (`boolean`), `user` (`DarkPrefUserSetting`), and `isDark` (`boolean`)`.

### DarkPref.reset()

Clear out any stored preference and resync. This always triggers the `darkpref:sync` event on the document.

### DarkPref.sync()

Used to trigger a resync of the current state. This always triggers the `darkpref:sync` event on the document.

### DarkPref.toggle(pref)

Changes the user preference. The `pref` argument is optional but should be a `boolean` or `null` if passed (`DarkPrefUserSetting` type).

The `DarkPref.current.user` value will be `null` when their dark preference aligns with the system preference.


## Docs: DarkPrefToggleBaseElement

Provides a custom element to extend for your own custom element. Automatically hookes up a `click` and `darkpref:sync` event handlers on `connectedCallback`.  Does not register a tag.

### ariaPressedForCurrentState (getter)

Provides a value for `aria-pressed` attribute. The button is considered pressed only if the user has a different prefence from the current system preference.

### ariaLabelForCurrentState (getter)

Provides a value for `aria-label` attribute.

### connectedCallback()

Connects `click` and `darkpref:sync` event handlers.

### disconnectedCallback()

Disconnects `click` and `darkpref:sync` event handlers.

### sync()

This needs to be implemented by the extending class. This should check `DarkPref.current` and implement necessary changes to the DOM.

### toggle(pref)

Changes the user preference. The `pref` argument is optional but should be a `boolean` or `null` if passed (`DarkPrefUserSetting` type).


## Docs: DarkPrefToggleElement

Provides a quick and easy button to toggle dark mode on/off. Provides two slots and two css variables for customization. This extends the `DarkPrefToggleBaseElement`. Automatically registers the tag name `dark-pref-toggle`.

There is a `dist/custom-elements.json` in the npm package.

### CSS Variables

 * `--dark-pref-when-dark-color`: Controls the `color` when dark is preferred (defaults to `#fff`)
 * `--dark-pref-when-light-color`: Controls the `color` when light is preferred (defaults to `#000`)

### Slots

* `light`: Defaults to a sun svg icon
* `dark`: Defults to a moon svg icon

## Usage with Astro

I'm using this on my personal site which is built with [Astro](https://astro.build/) and [TailwindCSS](https://tailwindcss.com/).

First I npm installed it:

```
npm install @brandonaaron/dark-pref
```

I copied over `dist/DarkPref.blocking.js` to the `public` directory and included that via an `is:inline` script tag in the `<head>` of my main layout:

```html
<script is:inline src="/DarkPref.bundled.nomodule.min.js"></script>
```

Then I created a `DarkPrefToggle.astro` component with the following:

```astro
---
---
<script>
  import { DarkPref } from '@brandonaaron/dark-pref/dist/DarkPref.js'
  import '@brandonaaron/dark-pref/dist/DarkPrefToggleElement.js'
  // The following lines is applicable only if you're using transitions
  document.addEventListener('astro:after-swap', () => { DarkPref.sync() })
</script>
<style>
  :root {
    --dark-pref-when-light-color: theme("colors.zinc.800");
    --dark-pref-when-dark-color: theme("colors.zinc.200");
  }
</style>
<dark-pref-toggle class="w-[24px] h-[24px]"></dark-pref-toggle>
```

My `tailwind.config.js` also has the following to ensure it works with html element dark mode class toggling:

```js
module.exports = {
  //...
  darkMode: 'class',
  //...
}
```
