module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1'
  },
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverage: true
}
