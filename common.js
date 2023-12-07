// common.js

class Common {
  static async wait(t) {
    return new Promise(e => setTimeout(e, t))
  }

  static log(msg) {
    console.log(msg)
  }
  
}

module.exports = Common
