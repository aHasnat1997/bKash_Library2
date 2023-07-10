const axios = require('axios');
const Agreement = require('./functions/agreement');
const Payment = require('./functions/payment');
const Transaction = require('./functions/transaction');


function BKash({ username, password, appKey, appSecret, isDev }) {
    const SANDBOX_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';
    const LIVE_URL = '';
    const URL = !isDev ? SANDBOX_URL : LIVE_URL;

    let refreshToken;
    let idToken;

    async function init() {
        try {
            const data = await req({
                url: '/checkout/token/grant',
                data: {
                    app_key: appKey,
                    app_secret: appSecret,
                }
            });

            refreshToken = data.refresh_token;
            idToken = data.id_token;

            return {
                agreement: new Agreement(),
                payment: new Payment(),
                trx: new Transaction()
            };
        } catch (err) {
            console.log(err);
        }
    }

    async function req({ url, data }) {
        try {
            let headers = {};
            if (url.endsWith('grant') || url.endsWith('refresh')) {
                headers = { username: username, password: password };
            } else {
                headers = { authorization: idToken, 'x-app-key': appKey };
            }

            const res = await axios({ method: 'POST', url: URL + url, headers, data });
            return res.data;
        } catch (e) {
            console.log(e);
        }
    }

    return {
        init,
        req
    };
}

module.exports = BKash;
