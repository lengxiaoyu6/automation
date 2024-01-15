const TaskClass = require('./taskClass/cpClass')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
const success = 30
const projectId = '738524' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '' //使用豪猪平台时填写对接码，可为空
const dm = require('./dmClass/cjyClass')
const config = {
    num: 0,
    apiUrl: 'https://ssqcx-serv.cwlo.com.cn/api',
    thread: 2,
    proxy: false,
    success,
    proxy_url: 'http://192.168.31.6:8083',
    projectId
}
const task = new TaskClass(config)
const main = async () => {
    await apiInstance.jmLogin()
    await task.thread(Array.from({ length: 9999 }), fun)
}

const fun = async () => {
    // await task.getip()
    const captcha = await task.get_captcha()
    let uuid = captcha?.data?.uuid
    if (captcha.code == 0) {
        let captcha_code = await dm.cjyLogin(captcha?.data?.captcha.replace('data:image/png;base64,', ''))
        captcha_code = Number(captcha_code)
        const mobile = await apiInstance.getPhone(projectId, uid)
        if (mobile) {
            const smsStatus = await task.sms(mobile, captcha_code, uuid)
            if (smsStatus) {
                const code = await apiInstance.getSms(mobile, projectId)
                if (code) {
                   await task.login(mobile, code)
                } else {
                    console.log('获取验证码失败，重新获取')
                    this.config.num--
                }
            }
        }
        if (task.success_num >= success) {
            task.exit()
        }
    }


}
main()