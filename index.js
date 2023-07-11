const express = require('express');
const BKash = require('./bKash/main');
require('dotenv').config();

const app = express();
const port = 5000;

const username = "sandboxTokenizedUser02";
const password = "sandboxTokenizedUser02@12345";
const appKey = "4f6o0cjiki2rfm34kfdadl1eqq";
const appSecret = "2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b";
const callbackURL = 'http://localhost:5000/';
const bKash = BKash({ username, password, appKey, appSecret });


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
        console.log(agreement + ' ' + ' line index.js 27');
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

app.listen(port, async () => {
    await bKash.init();
    console.log(`App listening on port ${port}`)
})

