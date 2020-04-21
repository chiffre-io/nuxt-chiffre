import { Module } from '@nuxt/types'

export interface Options {
  projectId?: string
  publicKey?: string
  debug: boolean
}

const defaultOptions: Options = {
  projectId: undefined,
  publicKey: undefined,
  debug: false,
}

const chiffreModule: Module<Options> = function (moduleOptions?: Options) {
  const options: Options = Object.assign(
    {},
    defaultOptions,
    moduleOptions,
    this.options.chiffre
  )

  const chiffreConfig = {
    id: 'chiffre:analytics-config',
    type: 'application/json',
    json: {
      ...(options.publicKey ? { publicKey: options.publicKey } : {}),
      ...(options.projectId
        ? { pushURL: `https://push.chiffre.io/event/${options.projectId}` }
        : {}),
    },
  }

  const chiffreScript = {
    src: 'https://embed.chiffre.io/analytics.js',
    crossOrigin: 'anonymous',
    async: true,
    defer: true,
  }

  const enabled =
    (!this.options.dev &&
      process.env.NODE_ENV === 'production' &&
      options.projectId &&
      options.publicKey) ||
    options.debug

  if (enabled && this.options.head && this.options.head.script) {
    this.options.head.script.push(chiffreConfig, chiffreScript)
  }
}

export default chiffreModule
