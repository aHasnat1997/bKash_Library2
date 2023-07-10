const express = require('express');
const BKash = require('./bKash/main');
require('dotenv').config();

const app = express();
const port = 3000;

const username = process.env.BKASH_USERNAME;
const password = process.env.BKASH_PASSWORD;
const appKey = process.env.BKASH_APPKEY;
const appSecret = process.env.BKASH_APPSECRET;
const callbackURL = 'http://localhost:3000/';
const bKash = new BKash(username, password, appKey, appSecret);


app.get('/', (req, res) => {
    res.status(200).send({ status: 'OK' })
})

app.get('/agreement', async (req, res) => {
    try {
        let agreement = await bKash.agreement?.create({
            mode: '0000',
            payerReference: '01770618575',
            callbackURL: callbackURL + 'agreementCallback'
        });

        return res.redirect(agreement?.bkashURL);
    } catch (err) {
        console.log(err);
        res.status(501).send({ status: err.message });
    }
});

app.get('/agreementCallback', async (req, res) => {
    try {
        const { paymentID, status } = req.query;
        if (status !== 'success') return res.status(400).send({ status });
        let agreement = await bKash.agreement?.execute(paymentID);

        if (agreement?.statusCode !== '0000') return res.status(400).send(agreement);

        const payment = await bKash.payment?.create({
            callbackURL: callbackURL + 'paymentCallback',
            agreementID: agreement.agreementID,
            mode: "0001",
            payerReference: "01770618575",
            "merchantAssociationInfo": "MI05MID54RF09123456One",
            "amount": "12",
            "currency": "BDT",
            "intent": "sale",
            "merchantInvoiceNumber": "Inv0124"
        });

        if (payment?.statusCode !== '0000') return res.status(400).send(payment);
        return res.redirect(payment?.bkashURL);
    } catch (err) {
        console.log(err);
        res.status(501).send({ status: err.message });
    }

});

app.get('/paymentCallback', async (req, res) => {
    try {
        const { paymentID, status } = req.query;
        res.status(200).send({ status, paymentID });
    } catch (err) {
        console.log(err);
        res.status(501).send({ status: err.message });
    }

});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})



