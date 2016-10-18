'use strict';
const Joi = require('joi');

const FooSchema = {

    dt: Joi.date().format('YYYY-MM-DDTHH:mm:ss.SSZ').required().description('Device\'s datetime UTC'),
    ds: Joi.object().keys({
        fl: Joi.number().required().description('Status flag'),
        t1: Joi.number().min(0).max(200).required().description('R1 tempertature'),
        t2: Joi.number().min(0).max(200).required().description('R2 temperature'),
        tb: Joi.number().min(0).max(60).required().description('Environment temperature range'),
        wg: Joi.number().min(0).max(50).required().description('Weigth bag waste'),
        ec: Joi.array().items(Joi.number().min(0).max(255)).min(0).max(5).description('Last 5 anomalies codes')
    }).description('Device status and anomalies codes')

};

module.exports = FooSchema;
