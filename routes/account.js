'use strict';
const AccountController = require('../controllers/account');
const Joi = require('joi');
module.exports = [{
  method: 'GET',
  path: '/accounts',
  config: {
    auth: false
  },
  handler: AccountController.list
},
{
  method: 'GET',
  path: '/account/{id}',
  
  handler: AccountController.get
},

// {
//   method: 'PUT',
//   path: '/favorite/add',
//   config: {
//     auth: {
//       scope: ['admin', 'host', 'worker']
//     },
//   },
//   handler: AccountController.addFavorite
// },

// {
//   method: 'PUT',
//   path: '/favorite/remove',
//   config: {
//     auth: {
//       scope: ['admin','host', 'worker']
//     },
//   },
//   handler: AccountController.removeFavorite
// },
// {
//   method: 'PUT',
//   path: '/blacklist/add',
//   config: {
//     auth: {
//       scope: ['admin', 'host', 'worker']
//     },
//   },
//   handler: AccountController.addToBlackList
// },

// {
//   method: 'PUT',
//   path: '/blacklist/remove',
//   config: {
//     auth: {
//       scope: ['admin', 'host', 'worker']
//     },
//   },
//   handler: AccountController.removeFromBlackList
// },
{
  method: 'POST',
  path: '/login',
  config: {
    auth: false
  },
  handler: AccountController.login
},
{
  method: 'GET',
  path: '/auth',
  config: {
    auth: false
  },
  handler: AccountController.auth
},

{
  method: 'POST',
  path: '/account',
  config: {
    auth: false
  },
  handler: AccountController.create
},
{
  method: 'PUT',
  path: '/account/{id}',
  
  handler: AccountController.update
},
// {
//   method: 'PUT',
//   path: '/account/upload-avatar',
//   config: {
//     auth: {
//       scope: ['admin', 'host', 'worker']
//     },
//   },
//   handler: AccountController.upload
// },
{
  method: 'DELETE',
  path: '/account/{id}',
  config: {
    auth: false
  },
  handler: AccountController.remove
},
// {
//   method: 'PUT',
//   path: '/account/status/{id}',
//   handler: AccountController.status
// },

{
  method: 'GET',
  path: '/accounts/search',
  config: {
    auth: false
  },
  handler: AccountController.search,
},
// {
//   method: 'PUT',
//   path: '/accounts/location/{id}',
//   config: {
//     auth: {
//       scope: ['admin', 'worker']
//     },
//   },
//   handler: AccountController.updateLocation
// }
]
