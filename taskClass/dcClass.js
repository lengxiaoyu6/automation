const got = require('got')
const fs = require('fs')
const path = require('path')
const qs = require('qs')
const Common = require('../common')
const { R, a, aesEncode } = require('../utils/dcsign')
let got_config = {}

class TaskClass extends Common {
  constructor(config = {}) {
    super(config)
    this.param = null
    this.api = config.apiUrl
    this.success_num = 0
    if (config.proxy) {
      const HttpsProxyAgent = require('https-proxy-agent')
      const agent = new HttpsProxyAgent(config.proxy_url)

      got_config.agent = {
        http: agent,
        https: agent
      }
    }
    this.got = got.extend({ https: { rejectUnauthorized: false }, ...got_config })
  }
  async request(opt = {}) {
    try {
      let httpParam = {
        headers: {
          Referer: 'https://servicewechat.com/wx1b44c3ad181bde16/30/page-frame.html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309071d)XWEB/8501',
          xweb_xhr: 1,
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
  async getip() {}
  //   排老
  async checkmobile(phone, apiInstance) {
    const params = {
      url: `${this.api}/innerdcapp/account/checkmobile?${qs.stringify(R.getParamsAPP({ mobileno: phone, _t: Math.random() }))}`,
      method: 'get'
    }
    try {
      const ip = await this.got('http://106.52.60.61:3366/ip').json()
      const res = await this.got(params).json()
      const { retcode, retmsg } = JSON.parse(a.decode(res))
      if (retcode === '1111') {
        this.log(`手机号：${phone} 已注册`, 'yellow')
        await apiInstance.releasePhone(phone, this.config.projectId)
        return false
      }
      return true
    } catch (error) {
      await apiInstance.releasePhone(phone, this.config.projectId)
      return false
    }
  }
  //   发送短信
  async sendSms(phone) {
    const params = {
      url: `${this.api}/innerdcapp/account/sendsms?${qs.stringify(R.getParamsAPP({ mobile: phone, _t: Math.random() }))}`,
      method: 'get'
    }
    try {
      const res = await this.got(params).json()
      const { retcode, retmsg } = JSON.parse(a.decode(res))
      if (retcode == '0000') {
        this.log(`手机号：${phone} 发送短信成功`, 'green')
        return true
      }
      this.log(`手机号：${phone} 发送短信失败`, 'yellow')
    } catch (error) {}
  }
  //注册
  async register(phone, code, salt = '123456') {
    let p = {
      authcode: code,
      password: aesEncode('qwer1234', salt),
      mobileno: phone,
      appkey: 'IX8pBy',
      appsecret: 'u9KMNq',
      channel: 'app_web',
      appversion: '1.0.0',
      market: 'web',
      ...this.config.help
    }
    const params = {
      url: `${this.api}/dcm-etrade-app/restful/account/registerweb`,
      method: 'post',
      body: `${qs.stringify(R.getParams(p))}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
      }
    }
    // console.log(R.getParams(p));
    let res
    try {
      res = await this.got(params).json()
    } catch (error) {
      res = await this.got(params).json()
    }

    const { retcode, retmsg } = res
    if (retcode == '0006') {
      await this.register(phone, code, retmsg)
    } else if (retcode == '0000') {
      this.log(`手机号：${phone} 注册成功`, 'green')
      this.success_num++
    } else {
      this.log(`${retmsg}`, 'green')
    }
  }
}

module.exports = TaskClass
