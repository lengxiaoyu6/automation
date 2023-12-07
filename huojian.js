const TaskClass = require('./taskClass/hjClass')
const pLimit = require('p-limit')
const limit = pLimit(1)
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
const max = 100
const success = 8
const projectId = '75926' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '75926-H4U1CAH2HK' //使用豪猪平台时填写对接码，可为空
const open_id = 'on4Pr6SRQleKo7Ccbqhhikd2PB8U'
const task = new TaskClass(open_id)
const main = async () => {
  await apiInstance.jmLogin()
  let status = true
  let i = 0
  for (let index = 0; index < max; index++) {
    limit(async () => {
      console.log(`第${i + 1}次任务开始`)
      const mobile = await apiInstance.getPhone(projectId, uid)
      if (mobile) {
        await task.sendSmsCode(mobile)
        const code = await apiInstance.getSms(mobile, projectId)
        if (code) {
          await task.login(mobile, code)
        } else {
          i--
          console.log('获取验证码失败，重新获取')
        }
      }
      console.log(`第${i + 1}次任务结束`)
      if (task.success_num >= success) {
        process.exit()
      }
    })
  }
}
main()
