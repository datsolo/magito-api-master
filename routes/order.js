'use strict';
const OrderController = require('../controllers/order');
module.exports = [{
  method: 'GET',
  path: '/orders',
  config: {
    auth: {
      scope: ['admin', 'host', 'worker']
    },
  },
  handler: OrderController.list
},
{
  method: 'GET',
  path: '/order/{id}',
  config: {
    auth: {
      scope: ['admin', 'host', 'worker']
    },
  },
  handler: OrderController.get
},
{
  method: 'POST',
  path: '/order',
  config: {
    auth: {
      scope: ['admin']
    },
  },
  handler: OrderController.create
},
{
  method: 'PUT',
  path: '/order/{id}',
  config: {
    auth: {
      scope: ['admin']
    },
  },
  handler: OrderController.update
},
{
  method: 'PUT',
  path: '/order/status/{id}',
  config: {
    auth: {
      scope: ['admin', 'host', 'worker']
    },
  },
  handler: OrderController.updateStatus
},
{
  method: 'PUT',
  path: '/order/finish/{id}',
  config: {
    auth: {
      scope: ['admin', 'host']
    },
  },
  handler: OrderController.finishOrder
},
{
  method: 'DELETE',
  path: '/order/{id}',
  config: {
    auth: {
      scope: ['admin']
    },
  },
  handler: OrderController.remove
},
{
  method: 'DELETE',
  path: '/order/empty',
  config: {
    auth: {
      scope: ['admin']
    },
  },
  handler: OrderController.empty
},
{
  method: 'GET',
  path: '/orders/history',
  config: {
    auth: {
      scope: ['host', 'worker']
    },
  },
  handler: OrderController.getHistory
}

]