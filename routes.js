const express = require('express');
const router = express.Router();
const { notify } = require('./handlers/notifier');

const createPayment = require('./handlers/payment-create');
const { deletePayments, deletePayment, updatePayment, cancelPayment } = require('./handlers/payment-editor')
const { getPayment, getPayments } = require('./handlers/payment-query');
const { paymentValidationRules, validate } = require('./handlers/validator.js')


module.exports = function (app) {
    router.get('/', getPayments);

    router.get('/:id', getPayment);

    router.post('/',
        paymentValidationRules(),
        validate,
        createPayment,
        notify
    );
    router.delete('/', deletePayments);

    router.delete('/:id', deletePayment);

    router.patch('/:id', updatePayment);

    router.patch('/:id/cancel', cancelPayment);

    app.use('/' + process.env.SERVICE_NAME, router);
};