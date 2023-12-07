const got = require('got')
const fs = require('fs')
const path = require('path')
const Common = require('../common')

class TaskClass extends Common {
  constructor(config = {}) {
    super(config)
    this.param = null
    this.success_num = 0
    this.openId = config?.open_id
  }
  async request(opt = {}) {
    try {
      let httpParam = {
        headers: {
          'Referer': 'https://servicewechat.com/wx1b44c3ad181bde16/30/page-frame.html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309071d)XWEB/8501',
          'xweb_xhr': 1,
          pro: 'RedRocket',
          pla: 'rr_windows',
          ticket: this.token,
          Host: 'index.amcfortune.com',
          'Content-Type': 'application/json',
          ver: '1.7.15'
        },
        statusInfo: 'code'
      }
      Object.assign(httpParam, opt)
      try {
        return await this.send(httpParam)
      } catch (error) {
        return { statusCode: -1 }
      }

    } catch (error) {
      this.log(error)
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
      return this.log(`${result}`)
    }
    this.log(`手机号：${mobile} 发送短信成功`, 'yellow')

    return result?.data.requestId
  }
  async login(mobile, code, requestId) {
    const params = {
      url: '/fundex-uc/uc/v1/login',
      body: {
        loginWay: 'mobileNo',
        platform: 'mini_fundex',
        phoneNo: mobile,
        captchaNo: code,
        requestId: requestId,
        openId: `o-S${this.randomString(25)}`,
        unionId: `ovv${this.randomString(25)}`,
        signAgreement: '为了更好地保障您的合法权益，请您阅读并同意用户协议、隐私政策',
        registerChannel: ''
      }
    }
    try {
      const { statusCode, result } = await this.request(params)
      if (statusCode != 200) {
        return this.log(`${result}`)
      }
      this.log(`手机号：${mobile} 登录成功`, 'bule')
      this.token = result?.data.token
      await this.get_red_packet()
    } catch (error) {
      this.log(`请求错误`)
    }

  }
  async get_red_packet(mobile, code) {
    const params = {
      url: `/fundex-activity/redPacket/queryTicketCodeRequest?key=${Date.now()}`,
      method: 'get'
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode != 200) {
      return this.log(`${result}`)
    }
    // console.log(result?.data);
    let tiCode = result?.data.ticketCode
    if (tiCode) {
      this.log(`获取到码子: ${tiCode}`, 'green')
      // this.log(`https://www.mktzb.com/mktadmin/wcode/wxAuth/cfyh?prjCode=${tiCode}`)
      // this.log(`${this.token}`)
      await this.exchange(tiCode)
    } else {
      await this.search_red_packet()
    }

  }
  async search_red_packet() {
    const params = {
      url: `/fundex-activity/redPacket/getUnclaimedList?key=${Date.now()}`,
      method: 'get'
    }
    const { statusCode, result } = await this.request(params)
    if (statusCode != 200) {
      return this.log(`${result}`)
    }
    let tiCode = result?.data[0]?.ticketCode
    if (tiCode) {
      this.log(`偷了一个码子: ${tiCode}`, 'green')
      await this.exchange(tiCode)
    } else {

    }

  }
  async exchange(code) {
    const params = {
      url: `https://www.mktzb.com/mktadmin/wcode/checkCodeRepeat`,
      method: 'post',
      body: `prj_code=${code}&prj_urltag=cfyh&openid=${this.openId}`,
      headers: {
        Origin: 'https://www.mktzb.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309071d)XWEB/8461',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie: `cfyh=${this.openId}`
      },
      https: { rejectUnauthorized: false }
    }
    const ret = await got(params).json()
    if (ret?.success) {
      this.log(`兑换成功${this.success_num}次`, 'red')
      this.success_num++
    } else {
      this.log(`兑换失败了`, 'red')
    }
  }
}
module.exports = TaskClass
