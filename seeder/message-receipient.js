
// Create dummy database for testing

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const faker = require('faker');
const async = require('async');
const Account = require('../models/account');
const Message = require('../models/message');

const _ = require('lodash');

new Promise((resolve) => {
    mongoose.connect('mongodb://localhost:27017/magitoapi', {
        promiseLibrary: require('bluebird')
    });
    async.parallel([
        (callback) => {
            Account.find({ phone: ['989632045', '1686170836'] }, { _id: 1 })
                .exec((err, worker_ids) => {
                    callback(null, worker_ids);
                });
        },
        (callback) => {
            Message.find({}, { _id: 1 })
                .exec((err, message_ids) => {
                    callback(null, message_ids);
                });
        }
    ],
        (err, results) => {
            resolve(results);
            // mongoose.connection.close();
        });
}).then((results) => {
    return new Promise((resolve) => {
        let items = [];

        for (i = 0; i < 20; i++) {
            items.push(
                {
                    account_id: _.sample(results[0])._id,
                    message_id: _.sample(results[1])._id,
                }
            );
        }
        resolve(items);
    });
}).then((items) => {
    seeder.connect('mongodb://localhost:27017/magitoapi', function () {
        let data = [{
            'model': 'Receipient',
            'documents': items
        }];
        seeder.loadModels([
            '../models/message-receipient'
        ]);
        seeder.clearModels(['Receipient'], function () {
            seeder.populateModels(data, function () {
                seeder.disconnect();
            });
        });
    });
});    
