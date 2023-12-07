const got = require('got')
const fs = require('fs')
const path = require('path')
const Common = require('../common')
const getApiInstance = require('../jmClass/jmClass')
const apiInstance = getApiInstance()

class TaskClass {
  constructor() {
    this.param = null
    this.apiUrl = 'https://tb.mocentre.cn/Wap/SetWord'
  }
  async request(opt = {}) {
    try {
      let httpParam = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi K30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
      Object.assign(httpParam, opt)
      const ret = await got({
        url: `${this.apiUrl}${httpParam?.url}`,
        method: httpParam?.method ? httpParam?.method : 'post',
        searchParams: httpParam?.searchParams,
        headers: httpParam?.headers,
        body: new URLSearchParams(httpParam?.body).toString()
      }).json()
      return { statusCode: ret?.code != undefined ? ret?.code : -1, result: ret?.code == 200 ? ret : ret?.msg }
    } catch (error) {
      Common.log(error)
    }
  }
  async sendSmsCode(mobile) {
    const params = {
      url: '/sendSmsCode',
      body: {
        phone: mobile,
        gameKey: 'jingcheng2023',
        param: 'hqZzqbB6c9qxp3Gof3zVoZJouW63kKyskt2Cm36koKSbz5acxH2I2L7deah_nq-hfXmtr8aAvKiSu4rOhKB6pZq5Z6C8aJrPxtCTqn94q7J6n9qixJG4n5O5pdB-oaCpnbmqpa95fN3IqnZhloyvoYCgpKyspsCsk5ZqupqPcqCCzKGbrJ-pzL26nJx7ntKtlY3brK98sKmU0YvRmKJlZZu1e2jFpIjWxqanmpV7yq6To7iisqabZJOrsNh-pGWkkpSmp7yNY8-tzaCmlovaq5eHoHY'
      }
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode !== 200) {
      return Common.log(`${result}`)
    }
    Common.log(`手机号：${mobile} 发送短信成功`)
  }
  /**
   * 登录
   */
  async login(mobile, code) {
    const params = {
      url: '/subPhone',
      body: {
        phone: mobile,
        code: code,
        gameKey: 'jingcheng2023',
        param: 'hqZzqbB6c9qxp3Gof3zVoZJouW63kKyskt2Cm36koKSbz5acxH2I2L7deah_nq-hfXmtr8aAvKiSu4rOhKB6pZq5Z6C8aJrPxtCTqn94q7J6n9qixJG4n5O5pdB-oaCpnbmqpa95fN3IqnZhloyvoYCgpKyspsCsk5ZqupqPcqCCzKGbrJ-pzL26nJx7ntKtlY3brK98sKmU0YvRmKJlZZu1e2jFpIjWxqanmpV7yq6To7iisqabZJOrsNh-pGWkkpSmp7yNY8-tzaCmlovaq5eHoHY'
      }
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode !== 200) {
      return Common.log(`${result}`)
    }
    Common.log(`手机号：${mobile} 登录成功`)
    this.param = result.param
    const dataFolderPath = path.join(__dirname, '../data')
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath)
    }
    fs.appendFileSync(path.join(dataFolderPath, 'param.txt'), `${mobile}@${this.param}\n`)
    Common.log(`${mobile}准备点灯`)
    Common.wait(1000)
    await this.receive(mobile)
  }
  /**
   * 点灯
   */
  async receive(mobile, token = null) {
    const params = {
      url: '/receive',
      body: {
        gameKey: 'jingcheng2023',
        param: this.param || token
      }
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode !== 200) {
      return Common.log(`${result}`)
    }
    Common.log(`${mobile} 点灯成功`)
    if (token) {
      Common.wait(1000)
      await apiInstance.releasePhone(mobile)
    }
  }
}
module.exports = TaskClass
