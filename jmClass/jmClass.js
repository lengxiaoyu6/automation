const haozhuClass = require('./haozhuClass')
const yeziClass = require('./yeziClass')
const taxinClass = require('./taxinClass')
const tianmaClass = require('./tianmaClass')
const jmConfig = require('../config/jmConfig')
const type = jmConfig.use

function getApiInstance() {
  switch (type) {
    case 'haozhu':
      return new haozhuClass()
    case 'yezi':
      return new yeziClass()
    case 'taxin':
      return new taxinClass()
    case 'tianma':
      return new tianmaClass()
    default:
      throw new Error('沙雕！！！！！')
  }
}

module.exports = getApiInstance
