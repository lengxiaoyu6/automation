// common.js
const got = require('got')
const pLimit = require('p-limit')
let agent = null
class Common {
  constructor(config = {}) {
    this.config = config
    this.runningTasks = 0
  }
  async wait(t) {
    return new Promise(e => setTimeout(e, t))
  }

  log(msg, color = '') {
    switch (color) {
      case 'red':
        console.log(`\u001B[31m${msg}\u001B[0m`)
        break
      case 'green':
        console.log(`\u001B[32m${msg}\u001B[0m`)
        break
      case 'yellow':
        console.log(`\u001B[33m${msg}\u001B[0m`)
        break
      case 'blue':
        console.log(`\u001B[34m${msg}\u001B[0m`)
        break
      case 'purple':
        console.log(`\u001B[35m${msg}\u001B[0m`)
        break
      default:
        console.log(msg)
        break
    }
  }
  exit() {
    this.log(`脚本即将结束`)
    process.exit(0)
  }
  get(obj, name, default_value = '') {
    let ret = default_value
    if (obj?.hasOwnProperty(name)) {
      ret = obj[name]
    }
    return ret
  }

  pop(obj, name, default_value = '') {
    let ret = default_value
    if (obj?.hasOwnProperty(name)) {
      ret = obj[name]
      delete obj[name]
    }
    return ret
  }
  async send(httpParam = {}) {
    let body = ``
    let type = httpParam?.headers?.['Content-Type']
    if (type.indexOf('application/json') != -1) {
      body = JSON.stringify(httpParam?.body)
    } else {
      body = new URLSearchParams(httpParam?.body).toString()
    }
    let params = {
      url: `${this.config.apiUrl}${httpParam?.url}`,
      method: httpParam?.method ? httpParam?.method : 'post',
      searchParams: httpParam?.searchParams,
      headers: httpParam?.headers,
      body,
      https: { rejectUnauthorized: false }
    }
    if (this.config.proxy) {
      if (!agent) {
        var HttpsProxyAgent = require('https-proxy-agent')
        agent = new HttpsProxyAgent(this.config.proxy_url)
      }
      params.agent = {
        http: agent,
        https: agent
      }
    }
    const ret = await got(params).json()
    return ret
    // let statusCode = this.get(ret, httpParam?.statusInfo, -1)
    // let result = statusCode == 200 ? ret : ret?.msg
    // return { statusCode, result }
  }
  randomString(len, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789') {
    let str = ''
    for (let i = 0; i < len; i++) {
      str += charset[Math.floor(Math.random() * charset.length)]
    }
    return str
  }
  randomInteger(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  // async thread(list, fun) {
  //   const limit = pLimit(this.config.thread)
  //   const input = Array.from(list, (x, index) =>
  //     limit(async () => {
  //       this.runningTasks++
  //       this.log(`正在执行第${index + 1}个任务`)
  //       fun && (await fun(x))
  //       this.log(`第${index + 1}次任务结束`)
  //       this.runningTasks--
  //       console.log(this.runningTasks)
  //     })
  //   )
  //   await Promise.all(input)
  // }
  async thread(list, fun) {
    this.taskQueue = [...list]
    const promises = []
    while (this.runningTasks < this.config.thread && this.taskQueue.length > 0 && this.success_num < this.config.success && this.config.num < this.config.success) {
      const task = this.taskQueue.shift()
      promises.push(this.runTask(task, fun))
    }
    await Promise.all(promises)
  }
  async runTask(task, fun) {
    this.runningTasks++
    try {
      this.config.num = this.config.num < 1 ? 0 : (this.config.num += 1)
      await fun(task)
    } catch (error) {
      this.taskQueue.push(task)
    }
    this.runningTasks--
    console.log(`i:${this.config.num}----success: ${this.config.success} ----${this.config.num < this.config.success}`)
    if (this.runningTasks < this.config.thread && this.taskQueue.length > 0 && this.success_num < this.config.success && this.config.num < this.config.success) {
      const task = this.taskQueue.shift()
      return this.runTask(task, fun)
    }
  }
}

module.exports = Common
