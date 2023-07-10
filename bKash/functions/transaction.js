function Transaction(parent) {
    async function query(trxID) {
        return await parent.req({
            url: '/checkout/general/searchTransaction',
            data: { trxID }
        });
    }

    return {
        query
    };
}

module.exports = Transaction;
