const { Payment } = require('../services/db');
const paymentTypeResolver = require('../services/payment-type-resolver');
const { validationResult } = require('express-validator')

module.exports = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            next(new Error({ errors: errors.array() }))
        }

        const { amount, currency, debtor_iban, creditor_iban, details, BIC } = req.body;

        await Payment.create({
            amount: amount,
            currency: currency,
            debtor_iban: debtor_iban,
            creditor_iban: creditor_iban,
            details: details,
            BIC: BIC
        })
            .then(payment => {
                req.paymentType = paymentTypeResolver.resolveType(payment);
                req.notify = payment.id;
                res.json(payment);
                global.logger.info(`Payment created ${payment}`);
            })
    } catch (err) {
        next(err);
    }
};