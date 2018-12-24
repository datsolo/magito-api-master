
// Create dummy database for testing
const seeder = require('mongoose-seed');
const faker = require('faker');
const Account = require('../models/account');
const Bcrypt = require('bcrypt');

let items = [];

for (i = 0; i < 10; i++) {
    items.push(
        {
            type: faker.random.arrayElement(['host', 'worker', 'admin']),
            name: faker.name.findName(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            gender: faker.random.arrayElement(['M', 'F']),
            alias: faker.name.findName(),
            subs_start: faker.date.past(),
            subs_expired: faker.date.future(),
            phone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            birthday: faker.date.past(),
            favorite: [],
            blacklist: [],
            address: {
                street_address: faker.address.streetAddress(),
                city: faker.address.city(),
                coordinates: [21.0 + Math.random()/10, 105.8 + Math.random()/10]
            },
            avatar: faker.image.avatar(),
            payments: [
                {
                    amount: faker.random.number({ min: 100000 }),
                    method: faker.random.arrayElement(['COD', 'ATM']),
                    created: faker.date.past()
                },
                {
                    amount: faker.random.number({ min: 100000 }),
                    method: faker.random.arrayElement(['COD', 'ATM']),
                    created: faker.date.past()
                }
            ],
            skills: faker.random.arrayElement(['body', 'foot', 'clean', 'washing', 'spa', 'cooking']),
            status: faker.random.arrayElement(['on', 'off']),
            ratings: faker.random.number({ min: 0, max: 5, precision: 0.1 }),
            state: faker.random.arrayElement(['enabled', 'disabled']),
            created: faker.date.past()
        }
    )
}

items.push(
    {
        type: 'worker',
        name: faker.name.findName(),
        username: 'worker',
        password: Bcrypt.hashSync('123@123a', 10),
        gender: faker.random.arrayElement(['M', 'F']),
        alias: faker.name.findName(),
        subs_start: faker.date.past(),
        subs_expired: faker.date.future(),
        phone: '1686170836',
        email: faker.internet.email(),
        birthday: faker.date.past(),
        favorite: [],
        blacklist: [],
        avatar: faker.image.avatar(),
        payments: [
            {
                amount: faker.random.number({ min: 100000 }),
                method: faker.random.arrayElement(['COD', 'ATM']),
                created: faker.date.past()
            },
            {
                amount: faker.random.number({ min: 100000 }),
                method: faker.random.arrayElement(['COD', 'ATM']),
                created: faker.date.past()
            }
        ],
        skills: faker.random.arrayElement(['body', 'foot', 'clean', 'washing', 'spa', 'cooking']),
        status: faker.random.arrayElement(['on', 'off']),
        ratings: faker.random.number({ min: 0, max: 5, precision: 0.1 }),
        state: faker.random.arrayElement(['enabled', 'disabled']),
    }
)

items.push(
    {
        type: 'host',
        name: faker.name.findName(),
        username: 'host',
        password: Bcrypt.hashSync('123@123a', 10),
        gender: faker.random.arrayElement(['M', 'F']),
        alias: faker.name.findName(),
        subs_start: faker.date.past(),
        subs_expired: faker.date.future(),
        phone: '989632045',
        email: faker.internet.email(),
        birthday: faker.date.past(),
        favorite: [],
        blacklist: [],
        address: {
            street_address: faker.address.streetAddress(),
            city: faker.address.city(),
            coordinates: [21.0 + Math.random(), 105.8 + Math.random()]
        },
        avatar: faker.image.avatar(),
        payments: [
            {
                amount: faker.random.number({ min: 100000 }),
                method: faker.random.arrayElement(['COD', 'ATM']),
                created: faker.date.past()
            },
            {
                amount: faker.random.number({ min: 100000 }),
                method: faker.random.arrayElement(['COD', 'ATM']),
                created: faker.date.past()
            }
        ],
        status: faker.random.arrayElement(['on', 'off']),
        ratings: faker.random.number({ min: 0, max: 5, precision: 0.1 }),
        state: faker.random.arrayElement(['enabled', 'disabled']),
    }
)

items.push(
    {
        type: 'admin',
        name: faker.name.findName(),
        username: 'admin',
        password: Bcrypt.hashSync('123@123a', 10),
        gender: 'M',
        alias: faker.name.findName(),
        subs_start: faker.date.past(),
        subs_expired: faker.date.future(),
        phone: '01832937921',
        email: faker.internet.email(),
        birthday: faker.date.past(),
        favorite: [],
        blacklist: [],
        address: {
            street_address: faker.address.streetAddress(),
            city: faker.address.city(),
            coordinates: [21.0 + Math.random(), 105.8 + Math.random()]
        },
        avatar: faker.image.avatar(),
        payments: [
            {
                amount: faker.random.number({ min: 100000 }),
                method: faker.random.arrayElement(['COD', 'ATM']),
                created: faker.date.past()
            },
            {
                amount: faker.random.number({ min: 100000 }),
                method: faker.random.arrayElement(['COD', 'ATM']),
                created: faker.date.past()
            }
        ],
        status: faker.random.arrayElement(['on', 'off']),
        ratings: faker.random.number({ min: 0, max: 5, precision: 0.1 }),
        state: faker.random.arrayElement(['enabled', 'disabled']),
    }
)

let data = [{
    'model': 'Account',
    'documents': items
}]

// connect mongodb
seeder.connect('mongodb://localhost:27017/magitoapi', function () {
    seeder.loadModels([
        '../models/account'
    ]);
    seeder.clearModels(['Account'], function() {
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });
    })
});

