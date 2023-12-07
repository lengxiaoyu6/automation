const got = require('got')
const jmConfig = require('./config/jmConfig')
const Common = require('./common')

class jmClass {
  constructor() {
    this.jmToken = ''
  }
  /**
   * 获取接码平台token
   */
  async jmLogin() {
    const res = await got(`${jmConfig.api}/api/logins?username=${jmConfig.account}&password=${jmConfig.password}`).json()
    if (res.data) {
      this.jmToken = res.token
      Common.log(`ID: ${res.data[0].id} 登录成功,余额: ${res.data[0].money}元`)
    } else {
      Common.log('接码平台登录失败')
    }
  }
  /**
   * 获取手机号
   *
   * @returns {string} 手机号
   */
  async getPhone() {
    const res = await got(`${jmConfig.api}/api/get_mobile?token=${this.jmToken}&project_id=${jmConfig.projectId}&loop=${jmConfig.loop}&operator=${jmConfig.operator}$api_id=243158&scope_black=${jmConfig.scopeBlack}`).json()
    if (res.message === 'ok') {
      Common.log(`获取号码成功: ${res.mobile}`)
      return res.mobile
    } else {
      Common.log('获取号码失败')
    }
  }
  /**
   * 获取短信
   *
   * @param {string} mobile 手机号
   *
   * @returns {string} 短信码
   */
  async getSms(mobile) {
    let code = null
    let i = 0
    while (i < 30) {
      const res = await got(`${jmConfig.api}/api/get_message?token=${this.jmToken}&phone_num=${mobile}&project_id=${jmConfig.projectId}`).json()
      if (res.data.length) {
        code = res.code
        Common.log(`${mobile}获取短信成功: ${code}`)
        break
      }
      await Common.wait(2000)
      Common.log(`${mobile}等待短信中... ${i}/30`)
      i++
    }
    await this.releasePhone(mobile)
    return code
  }
  /**
   * 释放手机号
   *
   * @param {string} mobile 手机号
   */
  async releasePhone(mobile) {
    const res = await got(`${jmConfig.api}/api/free_mobile?token=${this.jmToken}&phone_num=${mobile}&project_id=${jmConfig.projectId}`).json()
    if (res.message === 'ok') {
      Common.log(`释放手机号: ${mobile}`)
    } else {
      Common.log('释放手机号失败')
    }
  }
}

module.exports = jmClass
