const TaskClass = require('./taskClass/dcClass')
const pLimit = require('p-limit')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
const success = 10
const projectId = '57302' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '' //使用豪猪平台时填写对接码，可为空
const config = {
  apiUrl: 'https://dcapp.dcfund.com.cn',
  thread: 5,
  proxy: true,
  proxy_url: 'http://192.168.31.6:8082',
  help:{"activityid":"1a61fca2-6e28-4ea9-a42f-64c17a727d66","s":"NfMzea","t":"1703071641093","uniqueid":"efc2ffad-b56d-4f1f-a066-4b4cc0e9cf2c"},
  projectId
}
const task = new TaskClass(config)
const main = async () => {
  await apiInstance.jmLogin()
  await task.thread(Array.from({ length: 9999 }), fun)
}

const fun = async () => {
  const mobile = await apiInstance.getPhone(projectId, uid)
  if (mobile) {
    const status = await task.checkmobile(mobile,apiInstance)
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
