// common.js

class Common {
  static async wait(t) {
    return new Promise(e => setTimeout(e, t))
  }

  static log(msg) {
    console.log(msg)
  }
  static exit() {
    this.log(`脚本即将结束`)
    process.exit(0)
  }
  static get(obj, name, default_value = '') {
    let ret = default_value;
    if (obj?.hasOwnProperty(name)) {
      ret = obj[name];
    }
    return ret;
  }

  static pop(obj, name, default_value = '') {
    let ret = default_value;
    if (obj?.hasOwnProperty(name)) {
      ret = obj[name];
      delete obj[name];
    }
    return ret;
  }
  static async send() {
    const ret = await got({
      url: `${config.api}${httpParam?.url}`,
      method: httpParam?.method ? httpParam?.method : 'post',
      searchParams: httpParam?.searchParams,
      headers: httpParam?.headers,
      body: new URLSearchParams(httpParam?.body).toString()
    }).json()
    return { statusCode: ret?.code != undefined ? ret?.code : -1, result: ret?.code == 200 ? ret : ret?.msg }
  }
}

module.exports = Common
