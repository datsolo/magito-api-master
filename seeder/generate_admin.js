
const Bcrypt = require('bcrypt');
//const faker = require('faker');

var data = [
    {
        'model': 'Account',
        'documents': [
            {
                type: 'admin',
                name : 'Super admin',
                password: Bcrypt.hashSync('123@123a',10),
                service_name: 'Administrator',
                alias : 'admin',
                phone : '123456789',               
                email: 'duong@joombooking.com',
                birthday: '1992-10-10',
                status:'enabled'
            }
            
        ]
    }
];
// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost:27017/magitoapi', function() {
 
  // Load Mongoose models
  seeder.loadModels([
    '../models/account'
]);
 
  // Clear specified collections
  seeder.clearModels(['Account'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});