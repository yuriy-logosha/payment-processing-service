const { Payment } = require('../services/db');

const outscopeCancelled = { cancellation_date: { $exists: false } };

module.exports = {
    getPayments: async (req, res, next) => {
        try {
            //TODO: More filtering creterias can be added
            await Payment.find(outscopeCancelled).find(req.query)
                .select('_id amount')
                .then(payments => res.json(payments));
        } catch (err) {
            console.log(err)
            return next(err)
        }
    },
    getPayment: (req, res, next) => {
        try {
            Payment.findById(req.params.id)
                .catch(err => { console.log(err); res.status(500).send("There was a problem finding the payment.") })
                .then(payment => {
                    if (!payment) return res.status(404).send("No payment found.");
                    res.json(payment)
                    return next();
                });
        } catch (err) {
            console.log(err)
            return next(err);
        }
    }
};