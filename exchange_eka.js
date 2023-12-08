const got = require('got')
const H5ST = require('./utils/h5st41')
const fs = require('fs')
const path = require('path')
const file_path = path.join(__dirname,'data', 'eka.txt')   //  卡号文件
let cards_arr = fs.readFileSync(file_path, 'utf-8').toString().split('\r\n')  //  卡号列表
const cards = []
for (const item of cards_arr) {
    let k = item.split('----')
    if (k.length > 1) {
        cards.push(k[1]);
    } else {
        cards.push(k[0]);
    }
}
const CK = 'pt_key=app_openAAJlckBiADAZ7aZ8cmR_d5F2Sme5JntTv8nXxRD1_uyl3ne2v3jbIpWzQlZqHgcRmMVPJsoT9to; pt_pin=13541927086_p;'     //  填写自己的CK
const wait_time = 3000   //  等待时间
const getH5st = async (params) => {
    try {
        let new_H5ST = new H5ST({
            appId: 'becad',
            appid: 'm_core',
            clientVersion: '2.2.2', //6.0.0
            client: 'Win32',
            pin: decodeURIComponent(CK.match(/pt_pin=([^; ]+)(?=;?)/) && CK.match(/pt_pin=([^; ]+)(?=;?)/)[1]),
            ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            version: '3.1',
        });
        await new_H5ST.genAlgo();
        body = await new_H5ST.genUrlParams('balance_bindGiftCard_m', params); //拼接的url参数
        return body;
    } catch (error) { }
}
const wait = (t) => { return new Promise(e => setTimeout(e, t)) }
const exchange = async (ka = '') => {
    ka = ka.trim()
    let body = await getH5st(JSON.parse(decodeURIComponent(`%7B%22deviceUUID%22%3A%2225134576897364054%22%2C%22appId%22%3A%22wxae3e8056daea8727%22%2C%22tenantCode%22%3A%22jgm%22%2C%22bizModelCode%22%3A%223%22%2C%22bizModeClientType%22%3A%22M%22%2C%22token%22%3A%223852b12f8c4d869b7ed3e2b3c68c9436%22%2C%22externalLoginType%22%3A1%2C%22appVersion%22%3A%222.2.2%22%2C%22key%22%3A%22${ka}%22%2C%22giftType%22%3A%220%22%2C%22packageStyle%22%3Atrue%2C%22balanceCommonOrderForm%22%3A%7B%22action%22%3A0%2C%22overseaMerge%22%3Afalse%2C%22international%22%3Afalse%2C%22netBuySourceType%22%3A0%2C%22appVersion%22%3A%222.2.2%22%2C%22supportTransport%22%3Afalse%2C%22tradeShort%22%3Afalse%7D%2C%22balanceDeviceInfo%22%3A%7B%22resolution%22%3A%22430%2A932%22%7D%2C%22balanceId%22%3A%223251250040914984961701780668505%22%7D`)))
    // return
    const ret = await got({
        url: `https://api.m.jd.com/client.action`,
        method: 'post',
        body,
        headers: {
            Cookie: CK,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-Rp-Client': 'h5_1.0.0',
            Origin: 'https://trade.m.jd.com',
            Referer: 'https://trade.m.jd.com/'
        }
    }).json()
    console.log(`${ka}----${ret?.body?.message}`);
}
const main = async () => {
    for (const i of cards) {
        await exchange(i)
        await wait(wait_time)
    }
}
main()

// console.log(h5st);