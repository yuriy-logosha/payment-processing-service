const app = require('./app');

const port = process.env.API_PORT || 3000;

const server = app.listen(port, () => {
    console.log('Payment Processing API, listening on port ' + port);
    console.log('Service should be notified: ' + process.env.CUSTOME_SERVICE_URI);
    console.log('IP resolver service: ' + process.env.IP_RESOLVER_URI);
});