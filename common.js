// common.js
const got = require('got')
const pLimit = require('p-limit')
class Common {
  constructor(config = {}) {
    this.config = config
  }
  async wait(t) {
    return new Promise(e => setTimeout(e, t))
  }

  log(msg) {
    console.log(msg)
  }
  exit() {
    this.log(`脚本即将结束`)
    process.exit(0)
  }
  get(obj, name, default_value = '') {
    let ret = default_value;
    if (obj?.hasOwnProperty(name)) {
      ret = obj[name];
    }
    return ret;
  }

  pop(obj, name, default_value = '') {
    let ret = default_value;
    if (obj?.hasOwnProperty(name)) {
      ret = obj[name];
      delete obj[name];
    }
    return ret;
  }
  async send(httpParam = {}) {
    let body = ``
    let type = httpParam?.headers?.['Content-Type']
    if (type.indexOf('application/json') != -1) {
      body = JSON.stringify(httpParam?.body)
    } else {
      body = new URLSearchParams(httpParam?.body).toString()
    }
    const ret = await got({
      url: `${this.config.apiUrl}${httpParam?.url}`,
      method: httpParam?.method ? httpParam?.method : 'post',
      searchParams: httpParam?.searchParams,
      headers: httpParam?.headers,
      body
    }).json()
    let statusCode = this.get(ret, httpParam?.statusInfo, -1)
    let result = statusCode == 200 ? ret : ret?.msg
    return { statusCode, result }
  }
  async thread(list, fun) {
    const limit = pLimit(this.config.thread)
    const input = Array.from(list, (x, index) => limit(async () => {
      this.log(`正在执行第${index + 1}个任务`)
       fun && await fun(x)
      // await this.wait(1500)
      this.log(`第${index + 1}次任务结束`)
    }));

    await Promise.all(input);
  }
}

module.exports = Common
