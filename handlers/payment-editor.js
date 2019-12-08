const { Payment, ObjectId } = require('../services/db');
const paymentTypeResolver = require('../services/payment-type-resolver');
const config = require('../config');

module.exports = {
    deletePayment: async (req, res, next) => {
        try {
            await Payment.findByIdAndRemove(req.params.id).then(payment => {
                res.status(200).send("Payment " + payment._id + " was deleted.");
            }).catch(err => next(new Error("There was a problem deleting the payment.", e)));
        } catch (err) {
            return next(err)
        }
    },
    deletePayments: async (req, res, next) => {
        try {
            await Payment.deleteMany({}, (err, payment) => res.status(200).send("All payments was deleted."));
        } catch (err) {
            return next(err)
        }
    },
    updatePayment: async (req, res, next) => {
        try {
            const { creation_date } = req.body;
            const id = req.params.id;

            if (!ObjectId.isValid(id)) {
                return next(new Error("provide correct id"));
            }

            await Payment.findOneAndUpdate({ _id: id }, { $set: { creation_date: creation_date } }, { new: true })
                .then((docs) => {
                    if (docs) {
                        res.status(200).send("Payment " + docs.id + " was updated.")
                    } else {
                        return next(new Error("no such payment exist " + id));
                    }
                })

        } catch (err) {
            next(err)
        }
    },
    cancelPayment: async (req, res, next) => {
        try {
            await Payment.findById(req.params.id).then(async payment => {
                if (!payment) {
                    return next(new Error(`No payment with id: ${req.params.id}`));
                }
                
                const creation_date = new Date(payment.creation_date);          //12.11.2010 Z 21:00
                creation_date.setDate(creation_date.getDate() + 1);             //13.11.2010 Z 21:00
                creation_date.setHours(0, 0, 0, 0);                             //13.11.2010 Z 00:00

                if (!payment.creation_date || creation_date.getTime() - new Date().getTime() < 0)
                    return next(new Error(`Payment with id: ${payment.id} can not be cancelled.`));

                const hours = Math.round(Math.abs(Date.now() - payment.creation_date) / 36e5);

                const type = paymentTypeResolver.resolveType(payment);

                const k = (type === 3) ? config.type3_koef : (type === 2) ? config.type2_koef : config.type1_koef;

                const cnt = await Payment.updateOne({ _id: payment.id }, { cancellation_fee: hours * k, cancellation_date: Date.now() });

                if (cnt.nModified === 1) {
                    res.send(`Payment ${payment.id} was cancelled.`);
                    return next();
                } else {
                    return next(new Error(`Error cancelling payment: ${payment.id}`));
                }
            })
        } catch (err) {
            return next(err);
        }
    }
};