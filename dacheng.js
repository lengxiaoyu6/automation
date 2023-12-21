const TaskClass = require('./taskClass/dcClass')
const pLimit = require('p-limit')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
<<<<<<< HEAD
const success = 9
=======
const success = 2
>>>>>>> 8d94e16b18d524f0637ba998c4a5cdd7a157d084
const projectId = '57302' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '57302-KK7BWGO0D5' //使用豪猪平台时填写对接码，可为空
const config = {
<<<<<<< HEAD
  apiUrl: 'http://dcapp.dcfund.com.cn',
  thread: 1,
  proxy: false,
=======
  apiUrl: 'https://dcapp.dcfund.com.cn',
  thread: 2,
  proxy: true,
>>>>>>> 8d94e16b18d524f0637ba998c4a5cdd7a157d084
  proxy_url: 'http://47.108.75.71:3011',
  help: {
    activityid: '1a61fca2-6e28-4ea9-a42f-64c17a727d66',
    s: 'RnMz6z',
    t: '1703072715386',
    uniqueid: 'f35d13a5-cacc-4e7d-894b-794e8406a20a'
  },
  projectId
}
const task = new TaskClass(config)
const main = async () => {
  // await apiInstance.jmLogin()
  await task.thread(Array.from({ length: 9999 }), fun)
}

const fun = async () => {
<<<<<<< HEAD
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
        }
      }
    }
  }
  if (task.success_num >= success) {
    task.exit()
  }
=======
  await task.getip()
  // const mobile = await apiInstance.getPhone(projectId, uid)
  // if (mobile) {
  //   const status = await task.checkmobile(mobile, apiInstance)
  //   if (status) {
  //     const smsStatus = await task.sendSms(mobile)
  //     if (smsStatus) {
  //       const code = await apiInstance.getSms(mobile, projectId)
  //       if (code) {
  //         const regStatus = await task.register(mobile, code)
  //       } else {
  //         console.log('获取验证码失败，重新获取')
  //       }
  //     }
  //   }
  // }
  // if (task.success_num >= success) {
  //   task.exit()
  // }
>>>>>>> 8d94e16b18d524f0637ba998c4a5cdd7a157d084
}
main()
