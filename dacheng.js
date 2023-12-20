const TaskClass = require('./taskClass/dcClass')
const pLimit = require('p-limit')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
const success = 1
const projectId = '75926' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '75926-2MLC2WDICV' //使用豪猪平台时填写对接码，可为空
const config = {
  apiUrl: 'https://dcapp.dcfund.com.cn',
  open_id: 'on4Pr6VezLMVw92m59oBtuROLbcA',
  thread: 1,
  proxy: false,
  proxy_url: 'http://192.168.31.6:8082'
}
const task = new TaskClass(config)
const main = async () => {
  await apiInstance.jmLogin()
  await task.thread(Array.from({ length: 9999 }), fun)
}

const fun = async () => {
  const mobile = await apiInstance.getPhone(projectId, uid)
  if (mobile) {
    const status = await task.checkmobile(mobile)
    if (status) {
      const smsStatus = await task.sendSms(mobile)
      if (smsStatus) {
        const code = await apiInstance.getSms(mobile, projectId)
        if (code) {
          const regStatus = await task.register(mobile, code)
        } else {
          console.log('获取验证码失败，重新获取')
        }
      }
    }
  }
  if (task.success_num >= success) {
    task.exit()
  }
}
main()
