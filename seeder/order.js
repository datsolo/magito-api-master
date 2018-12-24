
// Create dummy database for testing

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const faker = require('faker');
const async = require('async');
const Account = require('../models/account');
const Job = require('../models/job');
const Order = require('../models/order');
const _ = require('lodash');

new Promise((resolve) => {
    mongoose.connect('mongodb://localhost:27017/magitoapi', {
        promiseLibrary: require('bluebird')
    });
    async.parallel([
        (callback) => {
            Account.find({ type: "worker" }, { _id: 1 })
                .exec((err, worker_ids) => {
                    callback(null, worker_ids);
                });
        },
        (callback) => {
            Job.find({ status: 1 })
                .exec((err, jobs) => {
                    callback(null, jobs);
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
        let status = [1, 2];
        for (i = 0; i < 20; i++) {
            let job = _.sample(results[1]);
            items.push(
                {
                    type: faker.random.arrayElement(['worker', 'host']),
                    worker: _.sample(results[0])._id,
                    host: job.host,
                    status: faker.random.arrayElement(['pending', 'confirmed', 'cancelled', 'noshow', 'delivered', 'rejected']),
                    start_time: job.start_time,
                    duration: job.duration,
                    endtime: job.endtime,
                    date: job.date,
                    changed_by: faker.random.arrayElement(['worker', 'host']),
                    price: job.price,
                    created: faker.date.recent()
                }
            );
        }
        resolve(items);
    });
}).then((items) => {
    seeder.connect('mongodb://localhost:27017/magitoapi', function () {
        let data = [{
            'model': 'Order',
            'documents': items
        }];
        seeder.loadModels([
            '../models/order'
        ]);
        seeder.clearModels(['Order'], function () {
            seeder.populateModels(data, function () {
                seeder.disconnect();
            });
        });
    });
});    
