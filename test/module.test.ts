import module, {
  Options,
  defaultOptions,
  chiffreEmbedScriptUrl,
  chiffrePushBaseUrl,
  chiffrePushNoScriptUrl,
} from '../src/module'
import { MetaInfo } from 'vue-meta'

interface ModuleThis {
  extendBuild(): void
  options: {
    dev: boolean
    head: MetaInfo
  }
  nuxt: undefined
  chiffreModule: (moduleOptions: Options) => Promise<void> | void
}

function generateModuleThis(chiffreOptions?: Options): ModuleThis {
  return {
    extendBuild: (): void => undefined,
    nuxt: undefined,
    options: {
      dev: false,
      head: {
        script: [],
        noscript: [],
      },
      ...(chiffreOptions ? { chiffre: chiffreOptions } : {}),
    },
    chiffreModule: module,
  }
}

function checkDisabled(moduleThis: ModuleThis): void {
  expect(moduleThis.options.head).toStrictEqual({ script: [], noscript: [] })
}

function checkEnabled(moduleThis: ModuleThis, chiffreOptions: Options): void {
  expect(moduleThis.options.head).toStrictEqual({
    script: [
      {
        id: 'chiffre:analytics-config',
        type: 'application/json',
        json: {
          publicKey: chiffreOptions.publicKey,
          pushURL: `${chiffrePushBaseUrl}/${chiffreOptions.projectId}`,
        },
        body: true,
      },
      {
        async: true,
        crossOrigin: 'anonymous',
        defer: true,
        src: chiffreEmbedScriptUrl,
        body: true,
      },
    ],
    noscript: [
      {
        body: true,
        once: true,
        hid: 'chiffre:noscript',
        vmid: 'chiffre:noscript',
        innerHTML: `<img
  src="${chiffrePushNoScriptUrl}/${chiffreOptions.projectId}?xhr=noscript"
  alt="Chiffre.io anonymous visit counting for clients without JavaScript"
  crossorigin="anonymous"
/>`,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'chiffre:noscript': ['innerHTML'],
    },
  })
}

describe('module nuxt-chiffre production', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
  })

  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  test('is disabled with default options', () => {
    const self = generateModuleThis()

    self.chiffreModule(defaultOptions)

    checkDisabled(self)
  })

  test('is enabled with projectId and publicKey', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule(defaultOptions)

    checkEnabled(self, chiffreOptions)
  })

  test('is disabled with undefined projectId', () => {
    const chiffreOptions = {
      projectId: undefined,
      publicKey: 'fake-public-key',
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule(defaultOptions)

    checkDisabled(self)
  })

  test('is disabled with undefined publicKey', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: undefined,
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule(defaultOptions)

    checkDisabled(self)
  })
})

describe('module nuxt-chiffre development', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  test('is disabled without debug mode', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule(defaultOptions)

    checkDisabled(self)
  })

  test('is enabled with debug mode', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      debug: true,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule(defaultOptions)

    checkEnabled(self, chiffreOptions)
  })
})
