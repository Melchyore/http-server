module.exports = require('@adonisjs/mrm-preset/_typedoc.js')({
  exclude: [
    '**/test/*.ts',
    'src/contracts.ts',
    'adonis-typings/index.ts',
  ],
  readme: 'none',
})
