const got = require('got')
const fs = require('fs')
const path = require('path')
const Common = require('../common')
const getApiInstance = require('../jmClass/jmClass')
const apiInstance = getApiInstance()

class TaskClass extends Common {
    constructor(config = {}) {
        super(config)
        this.api = config.apiUrl
    }
    async request(opt = {}) {
        try {
            let httpParam = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Redmi K30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36',
                    Origin: 'https://ssqcx-h1.cwlo.com.cn',
                    Referer: 'https://ssqcx-h1.cwlo.com.cn/',
                    Host: 'ssqcx-serv.cwlo.com.cn',
                    Authorization: opt?.token
                }
            }
            Object.assign(httpParam, opt)
            return await this.send(httpParam)
        } catch (error) {
            this.log(error)
        }
    }
    async get_captcha() {
        let params = {
            url: `/base/captcha`,
            body: `scenes=login&uuid=`
        }
        const ret = await this.request(params)
        return ret

    }
    async login(phone, code) {
        let params = {
            url: `/user/login`,
            body: `mobile=${phone}&code=${code}&form_source=login`
        }
        const ret = await this.request(params)
        if (ret?.code == 0) {
            this.log(`手机号：${phone} 登录成功,开始任务`, 'green')
            let token = ret?.data?.access_token
            // await this.wish_total(token)
            await this.wish_lottery(token)
            let count = Number(await this.get_lottery_count(token))
            if (count < 2) {
                await this.get_prize(phone,token)
            }
            while (count--) {
                await this.lottery(phone,token)
                await this.wait(3000)
            }
        }
        this.log(`手机号：${phone} 登录失败`, 'yellow')
        return false
    }
    async sms(phone, code, uuid) {
        let params = {
            url: `/base/sms`,
            body: `mobile=${phone}&sign=${this.md5(phone)}&scenes=login&uuid=${uuid}&captcha_code=${code}`
        }
        const ret = await this.request(params)
        if (ret?.code == 0) {
            this.log(`手机号：${phone} 发送短信成功`, 'green')
            return true
        }
        this.log(`手机号：${phone} 发送短信失败`, 'yellow')
        return false
    }
    async lottery(phone,token) {
        let params = {
            url: `/lottery/start`,
            token: token
        }
        const ret = await this.request(params)
        if (ret?.code == 0) {
            this.log(`手机号：${phone} ${JSON.stringify(ret?.data) || '空气'}`, 'green')
        } else {
            this.log(ret?.msg, 'red')
        }
    }
    async get_lottery_count(token) {
        let params = {
            url: `/user/info`,
            token: token
        }
        const ret = await this.request(params)
        if (ret?.code == 0) {
            this.log(`可以抽奖${ret?.data?.lottery_count}`, 'green')
            return ret?.data?.lottery_count
        }
        return 0
    }
    async get_prize(phone,token) {
        let params = {
            url: `/user/prize`,
            token: token
        }
        const ret = await this.request(params)
        if (ret?.code == 0) {
            this.log(`手机号：${phone}${JSON.stringify(ret?.data)}`)
        }
    }
    async wish_lottery(token) {
        let params = {
            url: `/wish/lottery`,
            token: token
        }
        const ret = await this.request(params)
        if (ret.code == 0) {
            this.log(`领取抽奖次数成功`, 'green')
            // this.log(`可以抽奖${ret?.data?.lottery_count}`, 'green')
            // return ret?.data?.lottery_count
        }
        return 0

    }
    async wish_total(token) {
        let params = {
            url: `/wish/total`,
            token: token
        }
        const ret = await this.request(params)
        console.log(ret);
        if (ret?.data?.status == 1) {
            this.log(`领取抽奖次数成功`, 'green')

        }
        return ret
    }
}
module.exports = TaskClass