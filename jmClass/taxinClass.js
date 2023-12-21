const got = require('got')
const jmConfig = require('../config/jmConfig')
const jm = jmConfig.taxin
const Common = require('../common')

class taxinClass extends Common {
  constructor() {
    super()
    this.jmToken = ''
  }
  /**
   * 获取接码平台token
   */
  async jmLogin() {
    const res = await got(`${jm.api}/Login/?username=${jm.username}&password=${jm.password}&type=json`).json()
    if (res.stat) {
      this.jmToken = res.data.token
      this.log(`接码登录成功,余额: ${res.data.money}元`)
    } else {
      this.log('接码平台登录失败')
    }
  }
  /**
   * 获取手机号
   * @param {string} projectId 项目id
   *
   * @returns {string} 手机号
   */
  async getPhone(projectId) {
    const res = await got(`${jm.api}/GetPhone/?token=${this.jmToken}&id=${projectId}&loop=${jm.loop}&isp=${jm.isp}&type=json`).json()
    if (res.stat) {
      // 判断号码的前三位是否是指定号段171或者165 162
      if (res.data.substr(0, 3) === '171') {
        this.log(`获取号码成功: ${res.data}`)
        return res.data
      }
      this.releasePhone(res.data, projectId)
      this.getPhone(projectId)
    } else {
      this.log(res.message)
    }
  }
  /**
   * 获取短信
   *
   * @param {string} mobile 手机号
   * @param {string} projectId 项目id
   *
   * @returns {string} 短信码
   */
  async getSms(mobile, projectId) {
    let code = null
    let i = 0
    while (i < 30) {
      const res = await got(`${jm.api}/GetMsg/?token=${this.jmToken}&phone=${mobile}&id=${projectId}&dev=lengxiaoyu&type=json`).json()
      if (res.stat) {
        const msg = res.data
        code = msg.match(/\d+/g).map(Number)
        this.log(`${mobile}获取短信成功: ${code[0]}`)
        break
      }
      await this.wait(2000)
      this.log(`${mobile}等待短信中... ${i}/30`)
      i++
    }
    await this.releasePhone(mobile, projectId)
    return code[0]
  }
  /**
   * 释放手机号
   *
   * @param {string} mobile 手机号
   */
  async releasePhone(mobile, id) {
    const res = await got(`${jm.api}/Cancel/?token=${this.jmToken}&phone=${mobile}&id=${id}&type=json`).json()
    if (res.stat) {
      this.log(`释放手机号: ${mobile}`)
    } else {
      this.log('释放手机号失败')
    }
  }
}

module.exports = taxinClass
