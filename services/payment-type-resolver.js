module.exports = {
    resolveType: (payment) => {
        try {
            if (!payment || !payment.toObject()) return;
        
            if (payment.toObject().hasOwnProperty("BIC")) {
                return 3;
            } else if (payment.currency == "USD") {
                return 2;
            } else {
                return 1;
            }
        } catch (err) {
            console.log(err)
        }
    }
}