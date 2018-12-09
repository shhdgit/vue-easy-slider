module.exports = {
  bail: true,
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/*.{js,vue}', '!src/alloyfinger.js'],
  coverageReporters: ['text'],
}
