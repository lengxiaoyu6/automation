const TaskClass = require('./taskClass/dcClass')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
const success = 5
const projectId = '2401' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '57302-KK7BWGO0D5' //使用豪猪平台时填写对接码，可为空
const config = {
  num: 0,
  apiUrl: 'http://dcapp.dcfund.com.cn',
  thread: 2,
  proxy: true,
  success,
  proxy_url: 'http://192.168.1.32:8083/help/proxy',
  help: {
    activityid: '1a61fca2-6e28-4ea9-a42f-64c17a727d66',
    s: 'uARfIb',
    t: '1703158014559',
    uniqueid: 'f9187012-4e4b-4837-ae35-f15a6b4faf5f'
  },
  projectId
}
const task = new TaskClass(config)
const main = async () => {
  await apiInstance.jmLogin()
  await task.thread(Array.from({ length: 9999 }), fun)
}

const fun = async () => {
  // await task.getip()

  const mobile = await apiInstance.getPhone(projectId, uid)
  if (mobile) {
    const status = await task.checkmobile(mobile, apiInstance)
    if (status) {
      const smsStatus = await task.sendSms(mobile)
      if (smsStatus) {
        const code = await apiInstance.getSms(mobile, projectId)
        if (code) {
          const regStatus = await task.register(mobile, code)
        } else {
          console.log('获取验证码失败，重新获取')
          this.config.num--
        }
      }
    }
  }
  if (task.success_num >= success) {
    task.exit()
  }
}
main()
