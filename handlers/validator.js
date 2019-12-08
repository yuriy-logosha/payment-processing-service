const { body, validationResult, oneOf } = require('express-validator');
const paymentValidationRules = () => {
    return oneOf([
        [
            body('amount', 'amount doesn`t exists').exists(),
            body('amount').isCurrency(),
            body('debtor_iban', 'debtor_iban doesn`t exists').exists(),
            body('creditor_iban', 'creditor_iban doesn`t exists').exists(),
            body('currency').isIn(['EUR']),
            body('details', 'details doesn`t exists').exists(),
        ],
        [
            body('amount', 'amount doesn`t exists').exists(),
            body('amount').isCurrency(),
            body('debtor_iban', 'debtor_iban doesn`t exists').exists(),
            body('creditor_iban', 'creditor_iban doesn`t exists').exists(),
            body('currency').isIn(['USD']),
            body('details', 'details doesn`t exists').optional().exists(),
        ],
        [
            body('amount', 'amount doesn`t exists').exists(),
            body('amount').isCurrency(),
            body('debtor_iban', 'debtor_iban doesn`t exists').exists(),
            body('creditor_iban', 'creditor_iban doesn`t exists').exists(),
            body('currency').isIn(['EUR', 'USD', 'GBP']),
            body('BIC', 'BIC doesn`t exists').exists()
        ]], 'Wrong payment type.')
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors
    })
}

module.exports = {
    paymentValidationRules,
    validate,
}