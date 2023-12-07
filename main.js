const TaskClass = require('./taskClass')
const config = require('./config/config')
const fs = require('fs')
const path = require('path')
const task = new TaskClass()
const main = async () => {
  if (config.registrationStatus) {
    await task.jmLogin()
    for (let i = 0; i < config.numberOfTasks; i++) {
      console.log(`第${i + 1}次任务开始`)
      const mobile = await task.getPhone()
      if (mobile) {
        await task.sendSmsCode(mobile)
        const code = await task.getSms(mobile)
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
    for (let i = 0; i < paramList.length; i++) {
      const param = paramList[i].split('@')
      if (param.length === 2) {
        console.log(`第${i + 1}次任务开始`)
        await task.receive(param[0], param[1])
        console.log(`第${i + 1}次任务结束`)
      }
    }
  }
}
main()
