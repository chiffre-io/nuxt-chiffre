# Chiffre Analytics for Nuxt.js

> Add Chiffre Analytics to your nuxt.js application

[![NPM Version](https://img.shields.io/npm/v/nuxt-chiffre)](https://www.npmjs.com/package/nuxt-chiffre)
[![GitHub Action CI/CD](https://github.com/chiffre-io/nuxt-chiffre/workflows/nuxt-chiffre%20CI/CD/badge.svg)](https://github.com/chiffre-io/nuxt-chiffre/actions?query=workflow%3A%22nuxt-chiffre+CI%2FCD%22)
[![Coverage Status](https://img.shields.io/codecov/c/github/chiffre-io/nuxt-chiffre)](https://codecov.io/gh/chiffre-io/nuxt-chiffre)

This [Nuxt.js] module automatically sends first page and route change events to [Chiffre Analytics]

## Setup

Install with:

```bash
npm install nuxt-chiffre
// or
yarn add nuxt-chiffre
```

Add `nuxt-chiffre` to modules section of `nuxt.config.js`:

```js
export default {
  modules: [['nuxt-chiffre']],
  chiffre: {
    projectId: '<chiffre-project-id>',
    publicKey: '<chiffre-public-key>',
    debug: false,
  },
}
```

## Module Options

### `projectId` (required)

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

[nuxt.js]: https://nuxtjs.org
[chiffre analytics]: https://chiffre.io
[mit]: https://github.com/chiffre-io/nuxt-chiffre/blob/master/LICENSE
[romain clement]: https://romain-clement.net
