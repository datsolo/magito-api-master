
// Create dummy database for testing

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const faker = require('faker');
const async = require('async');
const Account = require('../models/account');
const _ = require('lodash');

new Promise((resolve) => {
    mongoose.connect('mongodb://localhost:27017/magitoapi', {
        promiseLibrary: require('bluebird')
    });
    async.parallel([
        (callback) => {
            Account.find({}, { _id: 1 })
                .exec((err, account_ids) => {
                    callback(null, account_ids);
                });
        }
    ],
        (err, results) => {
            resolve(results);
            mongoose.connection.close();
        });
}).then((results) => {
    return new Promise((resolve) => {
        let items = [];

        for (i = 0; i < 20; i++) {
            items.push(
                {
                    user_id: _.sample(results[0])._id,
                    coordinates: [21.0 + Math.random()/10, 105.8 + Math.random()/10],
                    expired: faker.date.future(),
                }
            );
        }
        resolve(items);
    });
}).then((items) => {
    seeder.connect('mongodb://localhost:27017/magitoapi', function () {
        let data = [{
            'model': 'Session',
            'documents': items
        }];
        seeder.loadModels([
            '../models/session'
        ]);

        seeder.populateModels(data, function () {
            seeder.disconnect();
        });

    });
});    