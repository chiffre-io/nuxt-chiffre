import { MetaInfo } from 'vue-meta'
import module, { chiffreBaseUrl, defaultOptions, Options } from '../src/module'

interface ModuleThis {
  extendBuild(): void
  options: {
    dev: boolean
    head: MetaInfo
  }
  nuxt: undefined
  chiffreModule: (moduleOptions: Options) => Promise<void> | void
}

function generateModuleThisBase(chiffreOptions?: Options): ModuleThis {
  return {
    extendBuild: (): void => undefined,
    nuxt: undefined,
    options: {
      dev: false,
      head: {},
      ...(chiffreOptions ? { chiffre: chiffreOptions } : {}),
    },
    chiffreModule: module,
  }
}

function generateModuleThis(chiffreOptions?: Options): ModuleThis {
  const mod = generateModuleThisBase(chiffreOptions)
  mod.options.head.script = []
  mod.options.head.noscript = []
  return mod
}

function checkDisabled(moduleThis: ModuleThis): void {
  expect(moduleThis.options.head).toStrictEqual({ script: [], noscript: [] })
}

function checkEnabled(moduleThis: ModuleThis, chiffreOptions: Options): void {
  expect(moduleThis.options.head).toStrictEqual({
    script: [
      {
        async: true,
        crossOrigin: 'anonymous',
        defer: true,
        src: 'https://chiffre.io/analytics.js',
        body: true,
        id: 'chiffre:analytics',
        'data-chiffre-project-id': chiffreOptions.projectId,
        'data-chiffre-public-key': chiffreOptions.publicKey,
        'data-chiffre-ignore-paths': chiffreOptions.ignorePaths?.join(','),
      },
    ],
    noscript: [
      {
        body: true,
        once: true,
        hid: 'chiffre:noscript',
        innerHTML: `<img
  src="${chiffreBaseUrl}/noscript/${chiffreOptions.projectId}"
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

  test('is enabled with projectId and publicKey, with no base script and noscript', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      debug: false,
    }
    const self = generateModuleThisBase(chiffreOptions)

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

  test('supports ignorePaths option', () => {
    const chiffreOptions: Options = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      ignorePaths: ['/foo', '/bar'],
      debug: true,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule(defaultOptions)

    checkEnabled(self, chiffreOptions)
  })
})
