const frisby = require('frisby');
const request = require('request');
const Joi = frisby.Joi;
const serviceURI = "http://localhost:3000/";

const jsonType1 = {
    "amount": 100,
    "currency": "EUR",
    "debtor_iban": "EE061256142117251146",
    "creditor_iban": "EE411217896463868358",
    "details": "details..."
};

const jsonType2_1 = {
    "amount": 100,
    "currency": "USD",
    "debtor_iban": "EE061256142117251146",
    "creditor_iban": "EE411217896463868358",
    "details": "details..."
};

const jsonType2_2 = {
    "amount": 100,
    "currency": "USD",
    "debtor_iban": "EE061256142117251146",
    "creditor_iban": "EE411217896463868358"
};

const jsonType3_1 = {
    "amount": 100,
    "currency": "EUR",
    "debtor_iban": "EE061256142117251146",
    "creditor_iban": "EE411217896463868358",
    "BIC": "details..."
};

const jsonType3_2 = {
    "amount": 100,
    "currency": "USD",
    "debtor_iban": "EE061256142117251146",
    "creditor_iban": "EE411217896463868358",
    "BIC": "details..."
};

describe('Payment Types.', () => {
    it('Case: Should be able to save payments of Type 1.', function () {
        return frisby
            .post(serviceURI, jsonType1)
            .expect('status', 200)
            .expect('jsonTypes', {
                _id: Joi.string()
            })
            .expect('json', jsonType1)
            .then(res => {
                    if (res) {
                        frisby.delete(serviceURI + res._json._id)
                            .expect('status', 200)
                    }
                }
            );
    });

    it('Case: Should be able to save payments of Type 2: USD w/ details.', function () {
        return frisby
            .post(serviceURI, jsonType2_1)
            .expect('status', 200)
            .expect('jsonTypes', {
                _id: Joi.string()
            })
            .expect('json', jsonType2_1)
            .then(res => {
                if (res) {
                    frisby.delete(serviceURI + res._json._id)
                        .expect('status', 200)
                }
            });
    });

    it('Case: Should be able to save payments of Type 2: USD w/o details.', function () {
        return frisby
            .post(serviceURI, jsonType2_2)
            .expect('status', 200)
            .expect('jsonTypes', {
                _id: Joi.string()
            })
            .expect('json', jsonType2_2)
            .then(res => {
                if (res) {
                    frisby.delete(serviceURI + res._json._id)
                        .expect('status', 200)
                }
            });
    });

    it('Case: Should be able to save payments of Type 3: BIC w/ EUR.', function () {
        return frisby
            .post(serviceURI, jsonType3_1)
            .expect('status', 200)
            .expect('jsonTypes', {
                _id: Joi.string()
            })
            .expect('json', jsonType3_1)
            .then(res => {
                if (res) {
                    frisby.delete(serviceURI + res._json._id)
                        .expect('status', 200)
                }
            });
    });

    it('Case: Should be able to save payments of Type 3: BIC w/ USD', function () {
        return frisby
            .post(serviceURI, jsonType3_2)
            .expect('status', 200)
            .expect('jsonTypes', {
                _id: Joi.string()
            })
            .expect('json', jsonType3_2)
            .then(res => {
                if (res) {
                    frisby.delete(serviceURI + res._json._id)
                        .expect('status', 200)
                }
            });
    });

    it('Case: Should not save payment while wrong Payment Type.', function () {
        return frisby
            .post(serviceURI, {
                "amount": 100,
                "currency": "EUR",
                "debtor_iban": "EE061256142117251146",
                "creditor_iban": "EE411217896463868358"
            })
            .expect('status', 422)
    });

    it('Case: Should not save payment with negative amount', function () {
        return frisby
            .post(serviceURI, {
                "amount": -100,
                "currency": "EUR",
                "debtor_iban": "EE061256142117251146",
                "creditor_iban": "EE411217896463868358"
            })
            .expect('status', 422)
    });

    it('Case: Should not save payment with wrong currency', function () {
        return frisby
            .post(serviceURI, {
                "amount": 100,
                "currency": "UAH",
                "debtor_iban": "EE061256142117251146",
                "creditor_iban": "EE411217896463868358"
            })
            .expect('status', 422);
    });
});

describe('Payments retrieval.', () => {
    it('Case: Getting list of Payments', () => {
        return frisby
            .get(serviceURI)
            .expect('status', 200);
    });

    it('Case: Getting Payments with amount = 100', () => {
        return frisby
            .get(serviceURI + '?amount=100')
            .expect('status', 200);
    });

    it('Case: Should be able to retrieve Payment by id.', () => {
        return frisby.post(serviceURI, jsonType1)
            .expect('status', 200)
            .then(res => frisby.get(serviceURI + res._json._id)
                .expect('status', 200)
            );
    });
});

describe('Payment cancellation.', () => {
    it('Case: Client should be able to cancel payment only on the day of creation before 00:00.', () => {
        return frisby
            .post(serviceURI, jsonType1)
            .expect('status', 200)
            .then(res => frisby.patch(serviceURI + res._json._id + '/cancel')
                .expect('status', 200)
            );
    });

    it('Case: Should be able to cancel Payment: Type 1 after 1h stay into system.', () => {
        return frisby
            .post(serviceURI, jsonType1)
            .expect('status', 200)
            .then(res => {
                let id = res._json._id;
                return frisby.get(serviceURI + id)
                    .then(res => {
                        return frisby.patch(serviceURI + id, {
                            "creation_date": new Date(res._json.creation_date).getTime() + (1 * 60 * 60 * 1000),
                        })
                            .expect('status', 200)
                            .then(res => {
                                return frisby.patch(serviceURI + id + '/cancel')
                                    .expect('status', 200)
                                    .then(res => {
                                        return frisby.get(serviceURI + id)
                                            .expect('status', 200)
                                            .expect('jsonTypes', {
                                                cancellation_date: Joi.string(),
                                                cancellation_fee: Joi.number()
                                            }).then(res => {
                                                    expect(res._json._id).toBe(id)
                                                    expect(res.json.cancellation_fee).toBe(0.05)
                                                }
                                            )
                                    })
                            })
                    });
            });
    });

    it('Case: Should be able to cancel Payment: Type 2 after 1h stay into system.', () => {
        return frisby
            .post(serviceURI, jsonType2_1)
            .expect('status', 200)
            .then(res => {
                let id = res._json._id;
                return frisby.get(serviceURI + id)
                    .then(res => {
                        return frisby.patch(serviceURI + id, {
                            "creation_date": new Date(res._json.creation_date).getTime() + (1 * 60 * 60 * 1000),
                        })
                            .expect('status', 200)
                            .then(res => {
                                return frisby.patch(serviceURI + id + '/cancel')
                                    .expect('status', 200)
                                    .then(res => {
                                        return frisby.get(serviceURI + id)
                                            .expect('status', 200)
                                            .expect('jsonTypes', {
                                                cancellation_date: Joi.string(),
                                                cancellation_fee: Joi.number()
                                            }).then(res => {
                                                    expect(res._json._id).toBe(id)
                                                    expect(res.json.cancellation_fee).toBe(0.1)
                                                }
                                            )
                                    })
                            })
                    });
            });
    });


    it('Case: Should be able to cancel Payment: Type 3 after 1h stay into system.', () => {
        return frisby
            .post(serviceURI, jsonType3_1)
            .expect('status', 200)
            .then(res => {
                let id = res._json._id;
                return frisby.get(serviceURI + id)
                    .then(res => {
                        return frisby.patch(serviceURI + id, {
                            "creation_date": new Date(res._json.creation_date).getTime() + (1 * 60 * 60 * 1000),
                        })
                            .expect('status', 200)
                            .then(res => {
                                return frisby.patch(serviceURI + id + '/cancel')
                                    .expect('status', 200)
                                    .then(res => {
                                        return frisby.get(serviceURI + id)
                                            .expect('status', 200)
                                            .expect('jsonTypes', {
                                                cancellation_date: Joi.string(),
                                                cancellation_fee: Joi.number()
                                            }).then(res => {
                                                expect(res._json._id).toBe(id)
                                                expect(res.json.cancellation_fee).toBe(0.15)
                                            })
                                    })
                            })
                    });
            });
    });

    it('Case: Should not be able to cancel Payment after EOD of creation.', () => {
        return frisby
            .post(serviceURI, jsonType1)
            .expect('status', 200)
            .then(res => {
                    return frisby.patch(serviceURI + res._json._id, {
                            "creation_date": "2019-12-01T11:21:04.839Z",
                        }).expect('status', 200) &&
                        frisby.patch(serviceURI + res._json._id + '/cancel')
                            .expect('status', 500) &&
                        frisby.delete(serviceURI + res._json._id)
                            .expect('status', 200)
                }
            );

    });


    // it('Case: Deletion of all Payments.', () => {
    //     return frisby.delete(serviceURI)
    //         .expect('status', 200);

    // });
});


frisby.globalSetup({
    request: {
        timeout: 60000
    }
});


// n = 10000
// it('Performance test: Should be able to save payments of Type 1, ' + n + ' times.', function () {
//     let startTime = Date.now();
//     console.log("Performance cycle started at " + Date(startTime).toString());
//     for (let i = 0; i < n; i++) {
//         request.post(serviceURI, jsonType1, (err, res) => { console.log(err) });
//     }
//     console.log("Performance cycle finished at " + Date(Date.now()).toString());
//     console.log("Testing took " + Date(Date.now() - startTime).toString());
//     console.log("Result " + ((Date.now() - startTime) / 1000 / n / 60 / 60));
// });
