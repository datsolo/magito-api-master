'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountModel = new Schema({

  username: {type: String, required: true, index: { unique: true}},
  password: {type: String, required: true},
  phone: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: false, lowercase: true },
  created: {type:Date, default: Date.now  },
  
});
module.exports = mongoose.model('Account', accountModel);
