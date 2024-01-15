const got = require('got')
const fs = require('fs')
const path = require('path')
const Common = require('../common')
const getApiInstance = require('../jmClass/jmClass')
const apiInstance = getApiInstance()

class TaskClass extends Common {
  constructor(config = {}) {
    super(config)
    this.param = null
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
      return await this.send(httpParam)
    } catch (error) {
      this.log(error)
    }
  }
  async sendSmsCode(mobile) {
    const params = {
      url: '/sendSmsCode',
      body: {
        phone: mobile,
        gameKey: 'jingcheng2023',
        param: 'hqZzqbB6c9qxp3Gof3zVoZJouW63kKyskt2Cm36koKSbz5acxH2I2L7deah_nq-hfXmtr8aAvKiSu4rOhKB6pZq5Z6C8aJrPxtCTqn94q7J6n9qixJG4n5O5pdB-oaCpnbmqpa95fN3IqnZhloyvoYCgpKyspsCsk5ZqupqPcqCCzKGbrJ-pzL26nJx7ntKtlY3brK98sKmU0YvRmKJlZZu1e2jFpIjWxqanmpV7yq6To7iisqabZJOrsNh-pGWkkpSmp7yNY8-tzaCmlovaq5eHoHY'
      },
      method:'post'
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode !== 200) {
      return this.log(`${result}`)
    }
    this.log(`手机号：${mobile} 发送短信成功`)
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
      return this.log(`${result}`)
    }
    this.log(`手机号：${mobile} 登录成功`)
    this.param = result.param
    const dataFolderPath = path.join(__dirname, '../data')
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath)
    }
    fs.appendFileSync(path.join(dataFolderPath, 'param.txt'), `${mobile}@${this.param}\n`)
    this.log(`${mobile}准备点灯`)
    this.wait(1000)
    await this.getMyPrize(mobile)
  }

  // 奖品列表
  async getMyPrize(mobile, token = null) {
    const params = {
      url: '/getMyPrize',
      body: {
        gameKey: 'jingcheng2023',
        param: this.param || token
      }
    }
    const { statusCode, result, prize_list } = await this.request(params)
    if (statusCode !== 200) {
      return this.log(`${result}`)
    }
    if (result?.prize_list.length > 0) {
      this.log(result?.prize_list.map(item => item.prize_name + '----' + item.prize_pwd))
      // this.log(`${result?.prize_list[0]?.prize_name}----${result?.prize_list[0]?.prize_pwd}`)
      // console.log(mobile);
      // fs.appendFileSync(path.join(dataFolderPath, 'jd.txt'), `${result?.prize_list[0].prize_name}----${result?.prize_list[0].prize_pwd}\n`)
    } else {
      this.log(`${JSON.stringify(result?.prize_list)}`)
    }

    if (token) {
      Common.wait(1000)
      await this.releasePhone(mobile)
    }
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
      return this.log(`${result}`)
    }
    this.log(`${mobile} 点灯成功`)
    if (token) {
      this.wait(1000)
      await apiInstance.releasePhone(mobile)
    }
  }


}
module.exports = TaskClass
