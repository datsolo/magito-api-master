'use strict';
const JobController =  require('../controllers/job');
 module.exports=[
   {
	  method: 'GET',
    path: '/jobs',
    config:{
      auth: {
        scope: ['admin', 'host', 'worker']
        },
    },
	  handler: JobController.list
  },
  {
	  method: 'GET',
    path: '/jobs/history',
    config:{
      auth: {
        scope: ['host']
        },
    },
	  handler: JobController.getHistory
	},
  {
    method: 'POST',
    path: '/job',
    config:{
      auth: {
        scope: ['admin','host']
        },
    },
    handler: JobController.create
  },
  {
 	  method: 'GET',
 	  path: '/job/{id}',
 	  handler: JobController.get
 	},
  {
    method: 'PUT',
    path: '/job/{id}',
    config:{
      auth: {
        scope: ['admin','host']
        },
    },
    handler: JobController.update
  },
  {
    method: 'DELETE',
    path: '/job/{id}',
    config:{
      auth: {
        scope: ['admin','host']
        },
    },
    handler: JobController.remove
  },
  {
    method: 'DELETE',
    path: '/job/empty',
    config:{
      auth: {
        scope: ['admin','host']
        },
    },
    handler: JobController.empty
  }, 
  {
    method: 'PUT',
    path: '/job/cancel',
    config:{
      auth: {
        scope: ['admin','host']
        },
    },
    handler: JobController.cancel
  }

]
