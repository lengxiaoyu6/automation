const haozhuClass = require('./haozhuClass')
const yeziClass = require('./yeziClass')
const jmConfig = require('../config/jmConfig')
const type = jmConfig.use

function getApiInstance() {
  switch (type) {
    case 'haozhu':
      return new haozhuClass()
    case 'yezi':
      return new yeziClass()
    default:
      throw new Error('沙雕！！！！！')
  }
}

module.exports = getApiInstance
