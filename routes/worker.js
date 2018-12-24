'use strict';
const OrderController =  require('../controllers/order');
 module.exports=[
   {
	  method: 'POST',
    path: '/worker/apply',
    config: {
      auth:{
        scope:['admin','worker']
      }
   },
	  handler: OrderController.worker_create
  },
  {
	  method: 'POST',
    path: '/worker/accept',
    config: {
      auth:{
        scope:['worker']
      }
   },
	  handler: OrderController.worker_update
  },
  {
	  method: 'POST',
    path: '/worker/reject',
    config: {
      auth:{
        scope:['worker']
      }
    },
    handler: function(req,h){
      return OrderController.worker_cancel(req,h,'reject');
    }
  },
  {
	  method: 'POST',
    path: '/worker/cancel',
    config: {
      auth:{
        scope:['worker']
      }
   },
	  handler: function(req,h){
      return OrderController.worker_cancel(req,h,'cancel');
    }
	}

]

