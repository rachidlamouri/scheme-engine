module.exports = {
  extension: ['ts'],
  spec: 'src/**/*.test.ts',
  require: 'ts-node/register',
  watchFiles: ['src/**/*.ts', 'src/language/compiled/*.ts'],
}
