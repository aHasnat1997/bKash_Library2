function Agreement(parent) {

    // console.log(parent, '==========================> agreement.js //3');

    async function create(data) {
        return await parent.req({
            url: '/checkout/create',
            data
        });
    }

    async function execute(paymentID) {
        return await parent.req({
            url: '/checkout/execute',
            data: { paymentID }
        });
    }

    async function query(agreementID) {
        return await parent.req({
            url: '/checkout/agreement/status',
            data: { agreementID }
        });
    }

    async function cancel(agreementID) {
        return await parent.req({
            url: '/checkout/agreement/cancel',
            data: { agreementID }
        });
    }

    return {
        create,
        execute,
        query,
        cancel
    };
}

module.exports = Agreement;
