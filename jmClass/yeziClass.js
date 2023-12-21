const got = require('got')
const jmConfig = require('../config/jmConfig')
const jm = jmConfig.yezi
const Common = require('../common')

class yeziClass extends Common {
  constructor() {
    super()
    this.jmToken = ''
  }
  /**
   * 获取接码平台token
   */
  async jmLogin() {
    const res = await got(`${jm.api}/api/logins?username=${jm.account}&password=${jm.password}`).json()
    if (res.data) {
      this.jmToken = res.token
      this.log(`ID: ${res.data[0].id} 登录成功,余额: ${res.data[0].money}元`)
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
    const res = await got(`${jm.api}/api/get_mobile?token=${this.jmToken}&project_id=${projectId}&loop=${jm.loop}&operator=${jm.operator}&scope_black=${jm.scopeBlack}`).json()
    if (res.message === 'ok') {
      this.log(`获取号码成功: ${res.mobile}`)
      return res.mobile
    } else {
      this.log('获取号码失败')
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
      const res = await got(`${jm.api}/api/get_message?token=${this.jmToken}&phone_num=${mobile}&project_id=${projectId}`).json()
      if (res.data.length) {
        code = res.code
        this.log(`${mobile}获取短信成功: ${code}`)
        break
      }
      await this.wait(2000)
      this.log(`${mobile}等待短信中... ${i}/30`)
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
    const res = await got(`${jm.api}/api/free_mobile?token=${this.jmToken}&phone_num=${mobile}&project_id=${jm.projectId}`).json()
    if (res.message === 'ok') {
      this.log(`释放手机号: ${mobile}`)
    } else {
      this.log('释放手机号失败')
    }
  }
}

module.exports = yeziClass
