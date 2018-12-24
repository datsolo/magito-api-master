'use strict';
const SubscriberController = require('../controllers/subscriber');
module.exports = [{
    method: 'GET',
    path: '/subscribers',
    config:{
        auth: {
            scope: ['admin']
        },
    },
    handler: SubscriberController.list,
},
{
    method: 'POST',
    path: '/subscriber',
    handler: SubscriberController.create
},
{
 	  method: 'GET',
 	  path: '/subscriber/token/{account}',
 	  handler: SubscriberController.getToken
},
{
    method: 'GET',
    path: '/subscribers/tokens',
    handler: SubscriberController.getTokensByFilter
},
{
    method: 'DELETE',
    path: '/subscriber/{id}',
    config:{
        auth: {
            scope: ['admin']
        },
    },
    handler: SubscriberController.remove
},
{
    method: 'DELETE',
    path: '/subscriber/empty',
    config:{
        auth: {
            scope: ['admin']
        },
    },
    handler: SubscriberController.empty
}

]
