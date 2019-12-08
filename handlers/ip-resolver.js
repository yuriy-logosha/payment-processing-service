const request = require('request');

const apiKey = process.env.IP_RESOLVER_KEY || "safe zip code";
const serviceURI = process.env.IP_RESOLVER_URI;

module.exports = {
    ipResolver: async function (req, res, next) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            request(`${serviceURI}${ip}?access_key=${apiKey}`,
                (err, response, body) => {
                    global.logger.info((err) ? err : response.body)
                    next();
                });
        } catch (e) {
            next(e)
        }

    }
}