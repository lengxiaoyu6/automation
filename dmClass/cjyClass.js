const got = require('got')
const dmConfig = require('../config/dmConfig')
const Common = require('../common')
const qs = require('qs')
class cjyClass extends Common {
    constructor() {
        super()
    }
    async cjyLogin(file_base64) {
        let params = {
            url: `http://upload.chaojiying.net/Upload/Processing.php`,
            method: 'post',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `${JSON.stringify({
                ...dmConfig,
                file_base64
            })}`
        }
        // console.log(params);
        const ret = await got(params).json()
        return ret?.pic_str ? ret?.pic_str : ''
    }
}
module.exports = new cjyClass
