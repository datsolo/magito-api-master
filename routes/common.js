'use strict';
const Common =  require('../controllers/common');
const Joi = require('joi');
 module.exports=[

   {
     method: 'GET',
     path: '/skills',
     handler: Common.skills
   }


]


/*

  module.exports={
 	  method: 'GET',
 	  path: '/account/{id}',
 	  handler: AccountController.get
 	};




  module.exports={
    method: 'DELETE',
    path: '/account/{id}',
    handler: AccountController.remove
  };


  module.exports={
 	  method: 'POST',
 	  path: '/account',
 	  handler: AccountController.login
 	};
  */
