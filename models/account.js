'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountModel = new Schema({

  username: {type: String, required: true},
  password: {type: String, required: true},
  //M - Male, F-Female
  gender: {type: String, required: false},
  phone: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: false, lowercase: true },
  birthday: { type: Date, required: false },
  status: { type: String, required: false },
  created: {
	  type:Date,
	  default: Date.now
  },
  
});
module.exports = mongoose.model('Account', accountModel);
