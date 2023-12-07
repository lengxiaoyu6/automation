/**
 * 接码配置
 *
 * @param {string} api 接码平台地址
 * @param {string} account 接码平台账号
 * @param {string} password 接码平台密码
 * @param {string} projectId 接码平台项目ID,专属的就填对接码
 * @param {string} scopeBlack 接码平台排除号段应为逗号分割的字符串，如：170,171
 * @param {number} loop 是否过滤项目 1过滤 2不过滤 默认不过滤
 * @param {number} operator 运营商 0默认 1移动 2联通 3电信 4实卡 5虚卡
 *
 */
module.exports = {
  api: 'http://api.sqhyw.net:90',
  account: '',
  password: '',
  projectId: '733167',
  scopeBlack: '192,165,162,167',
  loop: 1,
  operator: 0
}
