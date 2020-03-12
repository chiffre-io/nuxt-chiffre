# Chiffre Analytics for Nuxt.js

> Add Chiffre Analytics to your nuxt.js application

This [Nuxt.js] module automatically sends first page and route change events to [Chiffre Analytics]

## Setup

Install with:

```bash
npm install @chiffre/nuxt-chiffre
// or
yarn add @chiffre/nuxt-chiffre
```

Add `nuxt-chiffre` to modules section of `nuxt.config.js`:

```js
export default {
  modules: [
    ['@chiffre/nuxt-chiffre'],
  ],
  chiffre: {
    projectId: '<chiffre-project-id>',
    publicKey: '<chiffre-public-key>',
    debug: false
  }
}
```

## Module Options

### `projectId` (require)

The Chiffre project identifier.

### `publicKey` (required)

The Chiffre project public key.

### `debug`

- Default: false

By default, the module is only enabled if:

- `projectId` is defined
- `publicKey` is defined
- Nuxt.js is not in development mode
- `process.env.NODE_ENV` is set to `production`

If `debug` is `true`, the module will always be enabled.

## License

[MIT] - Made by [Romain Clement](https://romain-clement.net).

[Nuxt.js]: https://nuxtjs.org
[Chiffre Analytics]: https://chiffre.io
[MIT]: https://github.com/rclement/nuxt-chiffre/blob/master/LICENSE
[Romain Clement]: https://romain-clement.net
