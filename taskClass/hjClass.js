const got = require('got')
const fs = require('fs')
const path = require('path')
const Common = require('../common')

class TaskClass {
  constructor(openId) {
    this.apiUrl = 'https://index.amcfortune.com'
    this.param = null
    this.success_num = 0
    this.openId = openId
  }
  async request(opt = {}) {
    try {
      let httpParam = {
        headers: {
          Referer: 'https://servicewechat.com/wx1b44c3ad181bde16/28/page-frame.html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309071d)XWEB/8461',
          xweb_xhr: 1,
          pro: 'RedRocket',
          pla: 'rr_windows',
          ticket: this.token,
          Host: 'index.amcfortune.com',
          'Content-Type': 'application/json'
        }
      }
      Object.assign(httpParam, opt)
      const ret = await got({
        url: `${this.apiUrl}${httpParam?.url}`,
        method: httpParam?.method ? httpParam?.method : 'post',
        searchParams: httpParam?.searchParams,
        headers: httpParam?.headers,
        // body: new URLSearchParams(httpParam?.body).toString()
        json: httpParam?.body
      }).json()
      return { statusCode: ret?.code != undefined ? ret?.code : -1, result: ret?.code == 200 ? ret : ret?.msg, prize_list: ret?.prize_list || [] }
    } catch (error) {
      Common.log(error)
    }
  }
  async sendSmsCode(mobile) {
    const params = {
      url: '/fundex-uc/uc/v1/getCaptcha',
      body: {
        phoneNo: mobile,
        captchaType: 'login'
      }
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode != 200) {
      return Common.log(`${result}`)
    }
    Common.log(`手机号：${mobile} 发送短信成功`)

    this.requestId = result?.data.requestId
  }
  async login(mobile, code) {
    console.log(mobile, code, this.requestId)
    const params = {
      url: '/fundex-uc/uc/v1/login',
      body: {
        loginWay: 'mobileNo',
        platform: 'mini_fundex',
        phoneNo: mobile,
        captchaNo: code,
        requestId: this.requestId,
        openId: 'o-Sr_5PoDJaQKIOd8tahW9dtFwjo',
        unionId: 'ovvDH5q99n6opyQEmn9UVcdN3ohM',
        signAgreement: '为了更好地保障您的合法权益，请您阅读并同意用户协议、隐私政策',
        registerChannel: ''
      }
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode != 200) {
      return Common.log(`${result}`)
    }
    Common.log(`手机号：${mobile} 登录成功`)
    this.token = result?.data.token
    await this.get_red_packet()
  }
  async get_red_packet(mobile, code) {
    const params = {
      url: `/fundex-activity/redPacket/queryTicketCodeRequest?key=${Date.now()}`,
      method: 'get'
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode != 200) {
      return Common.log(`${result}`)
    }
    let tiCode = result?.data.ticketCode

    await this.exchange(tiCode)
  }
  async exchange(code) {
    const params = {
      url: `https://www.mktzb.com/mktadmin/wcode/checkCodeRepeat`,
      method: 'post',
      body: `prj_code=${code}&prj_urltag=cfyh&openid=${this.openId}`,
      headers: {
        Origin: 'https://www.mktzb.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309071d)XWEB/8461',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
    const ret = await got(params).json()
    if (ret?.success) {
      Common.log(`兑换成功`)
      this.success_num++
    }
  }
}
module.exports = TaskClass
