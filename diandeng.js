const TaskClass = require('./taskClass/diandnegClass')
const fs = require('fs')
const path = require('path')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()

const numberOfTasks = 1 //任务数量
const registrationStatus = false //是否开启注册,false为养号
const projectId = '51000' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '' //使用豪猪平台时填写对接码，可为空
const config = {
  apiUrl: 'https://tb.mocentre.cn/Wap/SetWord',
  thread: 5
}
const task = new TaskClass(config)
const main = async () => {
  if (registrationStatus) {
    await apiInstance.jmLogin()
    for (let i = 0; i < numberOfTasks; i++) {
      console.log(`第${i + 1}次任务开始`)
      const mobile = await apiInstance.getPhone(projectId)
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
    }
  } else {
    const dataFolderPath = path.join(__dirname, 'data')
    if (!fs.existsSync(dataFolderPath)) {
      return console.log('没有token')
    }
    const paramFilePath = path.join(dataFolderPath, 'param.txt')
    if (!fs.existsSync(paramFilePath)) {
      return console.log('没有token')
    }
    const paramFile = fs.readFileSync(paramFilePath, 'utf-8')
    const paramList = paramFile.split('\n')
    await task.thread(paramList,fun)
  }
}
const fun = async (x) => {
  const param = x.split('@')
  if (param.length === 2) {
    await task.receive(param[0], param[1])
  }
}
main()
