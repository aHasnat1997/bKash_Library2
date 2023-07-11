const { default: axios } = require('axios');
const Agreement = require('./functions/agreement');
const Payment = require('./functions/payment');
const Transaction = require('./functions/transaction');


function BKash({ username, password, appKey, appSecret, isDev }) {
    // const SANDBOX_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';
    // const LIVE_URL = '';
    // const URL = !isDev ? SANDBOX_URL : LIVE_URL;
    const URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';

    let refreshToken;
    let idToken;

    async function init() {

        return new Promise(r => {
            req({
                url: '/checkout/token/grant',
                data: {
                    app_key: appKey,
                    app_secret: appSecret
                }
            }).then((data) => {

                refreshToken = data.refresh_token;
                idToken = data.id_token;

                // console.log(idToken, 'main.js //32');
                // console.log(this, '//31');

                const agreement = Agreement(this);

                // console.log(agreement.create, 'main.js //35');

                const payment = Payment(this);

                const trx = Transaction(this);

                r(this);

                return { agreement, payment, trx, refreshToken, idToken }
            }).catch(function (err) { console.log(err); });
        })

    }

    async function req({ url, data }) {
        const point = URL + url;

        try {
            let headers = {};
            if (point.endsWith('grant') || point.endsWith('refresh')) {
                headers = { username, password };
            } else {
                headers = { 'Authorization': idToken, 'X-app-key': appKey };
            }

            // const headers = point.endsWith('grant') || point.endsWith('refresh') ? headers = { username, password } : headers = { 'Authorization': idToken, 'X-app-key': appKey };

            console.log(headers, 'main.js //58');

            const res = await axios.post(point, data, { headers });
            // console.log(res.data, 'main.js //61');
            return res.data;
        } catch (e) {
            console.log(e);
        }
    }

    return { init, req };

}

module.exports = BKash;
