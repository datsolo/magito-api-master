
// Create dummy database for testing

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const faker = require('faker');
const async = require('async');
const Account = require('../models/account');
// const Job = require('../models/job');
const _ = require('lodash');

new Promise((resolve) => {
    mongoose.connect('mongodb://localhost:27017/magitoapi', {
        promiseLibrary: require('bluebird')
    });
    async.parallel([
        (callback) => {
            Account.find({ type: "host", phone: 989632045 }, { _id: 1 })
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

        for (i = 0; i < 10; i++) {
            let current = new Date();
            let tommorow = new Date(current.setDate(current.getDate() + 1));
            let future = new Date(current.setDate(current.getDate() + 3));
 
            items.push(
                {
                    name: faker.name.jobTitle(),
                    host: _.sample(results[0])._id,
                    status: faker.random.arrayElement([0, 1, 2]),
                    description: faker.lorem.paragraph(),
                    start_time: faker.date.recent(),
                    duration: faker.random.arrayElement([30, 45, 60, 90, 120]),
                    end_time: faker.date.between(tommorow.toISOString(), future.toISOString()),
                    seat: faker.random.arrayElement([1, 2, 3, 4, 5, 6]),
                    date: faker.date.recent(),
                    skills: faker.random.arrayElement(['body', 'foot', 'clean', 'washing', 'spa', 'cooking']),
                    worker: [],
                    price: faker.random.number({ min: 100000, max: 2000000, precision: 50000 }),
                    coordinates: [21.0 + Math.random()/10, 105.8 + Math.random()/10],  // coordinates Hanoi
                    status: faker.random.arrayElement([0, 1, 2]),
                    created: faker.date.past()
                }
            );
        }
        resolve(items);
    });
}).then((items) => {
    seeder.connect('mongodb://localhost:27017/magitoapi', function () {
        let data = [{
            'model': 'Job',
            'documents': items
        }];
        seeder.loadModels([
            '../models/job'
        ]);

        seeder.populateModels(data, function () {
            seeder.disconnect();
        });

    });
});
