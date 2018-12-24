'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionModel = new Schema({
  user_id: {type: String, require: true},
  //account type: host,worker
  data: [{
    role: {type: String, require: false}
  }],
  //status: BUSY- I'm busy at ABC
  coordinates: {
    type: [Number, Number],
    index: '2d'
  }, 
  expired: {
    type:Date,
	  default: Date.now
  },
  created: {
	  type:Date,
	  default: Date.now
  },
});

module.exports = mongoose.model('Session', sessionModel);
