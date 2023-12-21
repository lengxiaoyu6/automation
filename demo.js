const TaskClass = require('./taskClass/dcClass')
const pLimit = require('p-limit')
const getApiInstance = require('./jmClass/jmClass')
const apiInstance = getApiInstance()
const success = 30
const projectId = '57302' //项目id，使用椰子平台时可以直接填写专属对接码，使用豪猪请将对接码填写至uid
const uid = '57302-KK7BWGO0D5' //使用豪猪平台时填写对接码，可为空
const config = {
  apiUrl: 'http://dcapp.dcfund.com.cn',
  thread: 9,
  proxy: false,
  proxy_url: 'http://47.108.75.71:3011',
  projectId,
  success
}
const task = new TaskClass(config)
const main = async () => {
  await task.thread(Array.from({ length: 9999 }), fun)
}

const fun = async () => {
  await task.getip()
  if (task.success_num >= success) {
    task.exit()
  }
}
main()
