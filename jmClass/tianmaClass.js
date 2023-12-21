const got = require('got')
const jmConfig = require('../config/jmConfig')
const jm = jmConfig.tianma
const Common = require('../common')

class tianmaClass extends Common {
  constructor() {
    super()
    this.jmToken = ''
  }
  /**
   * 获取接码平台token
   */
  async jmLogin() {
    const res = await got(`${jm.api}/loginApi?account=${jm.account}&password=${jm.password}`).json()
    if (res.status == 200) {
      this.jmToken = res.data.token
      const user = await got(`${jm.api}/userinfo?token=${this.jmToken}`).json()
      this.log(`${user?.data.uid}登录成功,余额: ${user?.data.now_money}元`)
    } else {
      this.log('接码平台登录失败')
    }
  }
  /**
   * 获取手机号
   *
   * @param {string} cateId 项目id
   *
   * @returns {string} 手机号
   */
  async getPhone(cateId) {
    const queryString = new URLSearchParams({
      token: this.jmToken,
      cateId,
      ascription: jm.ascription,
      haoduan: jm.haoduan,
      paichu: jm.paichu,
      kid: jm.kid
    }).toString()
    const res = await got(`${jm.api}/service/getPhoneList?${queryString}`).json()
    if (res.status == 200) {
      this.log(`获取号码成功: ${res.data.list}`)
      return res.data.list
    } else {
      this.log(res.msg)
      this.log('获取号码失败')
    }
  }
  /**
   * 获取短信
   *
   * @param {string} phone 手机号
   * @param {string} cateId 项目id
   *
   * @returns {string} 短信码
   */
  async getSms(phone, cateId) {
    let code = null
    let i = 0
    while (i < 30) {
      const res = await got(`${jm.api}/service/getPhoneSms?token=${this.jmToken}&phone=${phone}&cateId=${cateId}&tid=4145`).json()
      if (res.data[0].content !== '') {
        const msg = res.data[0].content
        code = msg.match(/\d+/g).map(Number)
        this.log(`${phone}获取短信成功: ${code[0]}`)
        break
      }
      await this.wait(2000)
      this.log(`${phone}等待短信中... ${i}/30`)
      i++
    }
    await this.releasePhone(phone, cateId)
    return code[0]
  }
  /**
   * 释放手机号
   *
   * @param {string} phone 手机号
   * @param {string} cateId 项目id
   */
  async releasePhone(phone, cateId) {
    const res = await got(`${jm.api}/service/phoneHeiSms?token=${this.jmToken}&phone=${phone}&cateId=${cateId}`).json()
    this.log(res.msg)
  }
}

module.exports = tianmaClass
