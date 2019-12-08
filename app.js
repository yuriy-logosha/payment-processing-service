require('dotenv').config();
const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ipResolver } = require('./handlers/ip-resolver');

var tsFormat = () => (new Date()).toLocaleTimeString();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    // format: winston.format.json(),
    exitOnError: false,
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({ level: 'info', timestamp: tsFormat })
    ]
});

global.logger = logger;

const app = express();

app.use(cors());
app.use(ipResolver);
app.use(bodyParser.json());

require('./routes')(app);

// error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.status || 500);
});

module.exports = app;