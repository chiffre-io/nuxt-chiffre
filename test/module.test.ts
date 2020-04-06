import module, { Options } from '../src/module'
import { MetaInfo } from 'vue-meta'

interface ModuleThis {
  extendBuild(): void
  options: {
    dev: boolean
    head: MetaInfo
  }
  nuxt: undefined
  chiffreModule: (moduleOptions?: Options) => Promise<void> | void
}

function generateModuleThis(chiffreOptions?: Options): ModuleThis {
  return {
    extendBuild: (): void => undefined,
    nuxt: undefined,
    options: {
      dev: false,
      head: {
        script: [],
      },
      ...(chiffreOptions ? { chiffre: chiffreOptions } : {}),
    },
    chiffreModule: module,
  }
}

function checkDisabled(moduleThis: ModuleThis): void {
  expect(moduleThis.options.head).toStrictEqual({ script: [] })
}

function checkEnabled(moduleThis: ModuleThis, chiffreOptions: Options): void {
  expect(moduleThis.options.head).toStrictEqual({
    script: [
      {
        id: 'chiffre:analytics-config',
        type: 'application/json',
        json: {
          publicKey: chiffreOptions.publicKey,
          pushURL: `https://push.chiffre.io/${chiffreOptions.projectId}`,
        },
      },
      {
        async: true,
        crossOrigin: 'anonymous',
        defer: true,
        src: 'https://embed.chiffre.io/analytics.js',
      },
    ],
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

    self.chiffreModule()

    checkDisabled(self)
  })

  test('is enabled with projectId and publicKey', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule()

    checkEnabled(self, chiffreOptions)
  })

  test('is disabled with undefined projectId', () => {
    const chiffreOptions = {
      projectId: undefined,
      publicKey: 'fake-public-key',
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule()

    checkDisabled(self)
  })

  test('is disabled with undefined publicKey', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: undefined,
      debug: false,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule()

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

    self.chiffreModule()

    checkDisabled(self)
  })

  test('is enabled with debug mode', () => {
    const chiffreOptions = {
      projectId: 'fake-project-id',
      publicKey: 'fake-public-key',
      debug: true,
    }
    const self = generateModuleThis(chiffreOptions)

    self.chiffreModule()

    checkEnabled(self, chiffreOptions)
  })
})
