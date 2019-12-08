const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_SCHEMA, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

mongoose.connection.on('connected', function () {
    global.logger.info(`Database connection open to ${mongoose.connection.host} ${mongoose.connection.name}`);
});
mongoose.connection.on('error', function (err) {
    global.logger.info('DB connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    global.logger.info('DB disconnected.');
});

const NotificationSchema = new mongoose.Schema({
    paymentId: String,
    paymentType: Number,
    responseStatusCode: String,
    responseBody: String,
    creation_date: { type: Date, default: Date.now }
});

const PaymentSchema = new mongoose.Schema({ 
    amount: Number,
    currency: String,
    debtor_iban: String,
    creditor_iban: String,
    details: String,
    BIC: String,
    cancellation_fee: Number,
    cancellation_date: Date,
    creation_date: { type: Date, default: Date.now }
});

mongoose.model('Payment', PaymentSchema);
mongoose.model('Notification', NotificationSchema);

module.exports = {
    mongoose: mongoose,
    Notification: mongoose.model('Notification'),
    Payment: mongoose.model('Payment'),
    ObjectId: mongoose.Types.ObjectId
};