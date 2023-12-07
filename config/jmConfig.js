/**
 * 接码配置
 *
 * @param {string} api 接码平台地址
 * @param {string} account 接码平台账号
 * @param {string} password 接码平台密码
 * @param {string} scopeBlack 接码平台排除号段应为逗号分割的字符串，如：170,171
 * @param {number} loop 是否过滤项目 1过滤 2不过滤 默认不过滤
 * @param {number} operator 运营商 0默认 1移动 2联通 3电信 4实卡 5虚卡
 *
 */
module.exports = {
  yezi: {
    api: 'http://api.sqhyw.net:90',
    account: '13263860590',
    password: 'wang520QQ',
    scopeBlack: '192,165,162,167',
    loop: 1,
    operator: 0
  },
  haozhu: {
    api: 'http://api.haozhuma.com',
    user: 'a614622787', //账号
    pass: 'lxl123456', //密码
    ascription: '2', //号码类型，留空为不限制，ascription=1只取虚拟，ascription=2只取实卡
    Province: '', //号码省份，可留空
    paragraph: '', //只取号段，留空为不限制 使用 | 符号
    exclude: '' //排除号段，留空为不限制 使用 | 符号
  },
  use: 'haozhu' //使用的平台
}
