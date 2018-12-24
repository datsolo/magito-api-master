'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageModel = new Schema({
  title: {type: String, required: false},
  body: {type: String, required: true, default: ''},
  topic: {type: String, required: false}, // topic fcm
  fcm_success: {type: Boolean, required: true, default: false},
  created_at:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', messageModel, 'message');
