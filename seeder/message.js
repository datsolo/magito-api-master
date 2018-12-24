
// Create dummy database for testing
const seeder = require('mongoose-seed');
const faker = require('faker');

let items = [];

for (i = 0; i < 30; i++) {
    items.push(
        {
            type: faker.random.arrayElement(['invididual', 'social']),
            title: faker.name.title(),
            body: faker.lorem.paragraph(),
            topic: faker.lorem.slug(),
            fcm_success: faker.random.arrayElement(['true', 'false']),
            created_at: faker.date.past()
        }
    )
}


let data = [{
    'model': 'Message',
    'documents': items
}]

// connect mongodb
seeder.connect('mongodb://localhost:27017/magitoapi', function () {
    seeder.loadModels([
        '../models/message'
    ]);
    //empty collection before populating
    seeder.clearModels(['Message'], function () {
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });
    });
});
