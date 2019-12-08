const { get } = require('request');
const { Notification } = require('../services/db');

const serviceURI = process.env.CUSTOME_SERVICE_URI;

module.exports = {
    notify: async (req, res, next) => {
        if (!req.notify || !req.paymentType) {
            return next();
        }

        try {
            get(serviceURI + '?id=' + req.notify + '&type=' + req.paymentType,
                async (error, response, body) => {

                    const statusCode = (error) ? error.code : response.statusCode;
                    const responseBody = (error) ? error.message : response.body;

                    await Notification.create({
                        paymentId: req.notify,
                        paymentType: req.paymentType,
                        responseStatusCode: statusCode,
                        responseBody: responseBody,
                    })
                        .then(notification => global.logger.info(notification))
                        .catch(err => global.logger.error(err));
                });
        } catch (e) {
            next(e);
        }
    }
}