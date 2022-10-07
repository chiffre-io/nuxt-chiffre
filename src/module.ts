import { Module } from '@nuxt/types'

export const chiffreBaseUrl = 'https://chiffre.io'

export interface Options {
  projectId?: string
  publicKey?: string
  ignorePaths?: string[]
  debug: boolean
}

export const defaultOptions: Options = {
  projectId: undefined,
  publicKey: undefined,
  ignorePaths: undefined,
  debug: false,
}

const chiffreModule: Module<Options> = function (moduleOptions) {
  const options: Options = Object.assign(
    {},
    defaultOptions,
    moduleOptions,
    this.options.chiffre
  )

  const chiffreScript = {
    src: `${chiffreBaseUrl}/analytics.js`,
    id: 'chiffre:analytics',
    crossOrigin: 'anonymous',
    async: true,
    defer: true,
    body: true,
    'data-chiffre-project-id': options.projectId,
    'data-chiffre-public-key': options.publicKey,
    'data-chiffre-ignore-paths': options.ignorePaths?.join(','),
  }

  const chiffreNoScript = {
    body: true,
    once: true,
    hid: 'chiffre:noscript',
    innerHTML: `<img
  src="${chiffreBaseUrl}/noscript/${options.projectId}"
  alt="Chiffre.io anonymous visit counting for clients without JavaScript"
  crossorigin="anonymous"
/>`,
  }

  const enabled =
    (!this.options.dev &&
      process.env.NODE_ENV === 'production' &&
      options.projectId &&
      options.publicKey) ||
    options.debug

  if (enabled && typeof this.options.head === 'object') {
    this.options.head.script = [
      ...(this.options.head.script || []),
      chiffreScript,
    ]

    this.options.head.noscript = [
      ...(this.options.head.noscript || []),
      chiffreNoScript,
    ]

    this.options.head.__dangerouslyDisableSanitizersByTagID = {
      ...this.options.head.__dangerouslyDisableSanitizersByTagID,
      'chiffre:noscript': ['innerHTML'],
    }
  }
}

export default chiffreModule
