function Payment(parent) {
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

    async function query(paymentID) {
        return await parent.req({
            url: '/checkout/payment/status',
            data: { paymentID }
        });
    }

    return {
        create,
        execute,
        query
    };
}

module.exports = Payment;
