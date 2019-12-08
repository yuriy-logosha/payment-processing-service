const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 3004;

app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(port, () => {
    console.log('Service, listening on port ' + port);
});




const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

app.get('/:code', (req, res, next) => {
    console.log(req.url);
    res.send(200);
});

app.get('/notify', (req, res, next) => {
    if (getRandomInt(10) > 5) {
        console.info(req.query);
        res.send(200);
    } else {
        console.error(req.query);
        res.send(500);
    }
});

app.post('/notify', (req, res, next) => {
    console.log(req.body);
    res.status(200).json('got it');
});