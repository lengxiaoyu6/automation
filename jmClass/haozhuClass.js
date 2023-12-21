const got = require('got')
const jmConfig = require('../config/jmConfig')
const jm = jmConfig.haozhu
const Common = require('../common')

class haozhuClass extends Common {
  constructor() {
    super()
    this.jmToken = ''
  }
  /**
   * 获取接码平台token
   */
  async jmLogin() {
    const res = await got(`${jm.api}/sms/?api=login&user=${jm.user}&pass=${jm.pass}`).json()
    if (res.code == 0) {
      this.jmToken = res.token
      const money = await got(`${jm.api}/sms/?api=getSummary&token=${this.jmToken}`).json()
      this.log(`登录成功,余额: ${money.money}元`)
    } else {
      this.log('接码平台登录失败')
    }
  }
  /**
   * 获取手机号
   *
   * @param {string} sid 项目id
   * @param {string} uid 对接码
   *
   * @returns {string} 手机号
   */
  async getPhone(sid, uid = null) {
    const queryString = new URLSearchParams({
      api: 'getPhone',
      token: this.jmToken,
      sid: sid,
      author: 'lengxiaoyu666',
      Province: jm.Province,
      ascription: jm.ascription,
      paragraph: jm.paragraph,
      exclude: jm.exclude,
      ...(uid !== null && { uid: uid })
    }).toString()
    const res = await got(`${jm.api}/sms/?${queryString}`).json()
    if (res.code == 0) {
      this.log(`获取号码成功: ${res.phone}`)
      return res.phone
    } else {
      this.log(res.msg)
      this.log('获取号码失败')
    }
  }
  /**
   * 获取短信
   *
   * @param {string} phone 手机号
   * @param {string} sid 项目id
   *
   * @returns {string} 短信码
   */
  async getSms(phone, sid) {
    let code = null
    let i = 0
    while (i < 30) {
      const res = await got(`${jm.api}/sms/?api=getMessage&token=${this.jmToken}&phone=${phone}&sid=${sid}`).json()
      if (res.code == 0) {
        code = res.yzm
        this.log(`${phone}获取短信成功: ${code}`)
        break
      }
      await this.wait(2000)
      this.log(`${phone}等待短信中... ${i}/30`)
      i++
    }
    await this.releasePhone(phone, sid)
    return code
  }
  /**
   * 释放手机号
   *
   * @param {string} phone 手机号
   * @param {string} sid 项目id
   */
  async releasePhone(phone, sid) {
    const res = await got(`${jm.api}/sms/?api=cancelRecv&token=${this.jmToken}&phone=${phone}&sid=${sid}`).json()
    this.log(res.msg)
  }
}

module.exports = haozhuClass
