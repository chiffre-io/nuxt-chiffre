import { Module } from '@nuxt/types'

export const chiffreEmbedScriptUrl = 'https://embed.chiffre.io/analytics.js'
export const chiffrePushBaseUrl = 'https://push.chiffre.io/event'
export const chiffrePushNoScriptUrl = 'https://push.chiffre.io/noscript'

export interface Options {
  projectId?: string
  publicKey?: string
  debug: boolean
}

export const defaultOptions: Options = {
  projectId: undefined,
  publicKey: undefined,
  debug: false,
}

const chiffreModule: Module<Options> = function (moduleOptions) {
  const options: Options = Object.assign(
    {},
    defaultOptions,
    moduleOptions,
    this.options.chiffre
  )

  const chiffreConfig = {
    id: 'chiffre:analytics-config',
    type: 'application/json',
    body: true,
    json: {
      ...(options.publicKey ? { publicKey: options.publicKey } : {}),
      ...(options.projectId
        ? { pushURL: `${chiffrePushBaseUrl}/${options.projectId}` }
        : {}),
    },
  }

  const chiffreScript = {
    src: chiffreEmbedScriptUrl,
    crossOrigin: 'anonymous',
    async: true,
    defer: true,
    body: true,
  }
  const chiffreNoScriptImg = `<img
  src="${chiffrePushNoScriptUrl}/${options.projectId}?xhr=noscript"
  alt="Chiffre.io anonymous visit counting for clients without JavaScript"
  crossorigin="anonymous"
/>`

  const enabled =
    (!this.options.dev &&
      process.env.NODE_ENV === 'production' &&
      options.projectId &&
      options.publicKey) ||
    options.debug

  if (enabled && this.options.head && this.options.head.script) {
    this.options.head.script.push(chiffreConfig, chiffreScript)
    this.options.head.noscript?.push({
      body: true,
      innerHTML: chiffreNoScriptImg,
    })
  }
}

export default chiffreModule
