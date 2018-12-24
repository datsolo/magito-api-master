'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationModel = new Schema({
  account_id: {type: Schema.ObjectId, ref: 'Account'},
  title: {type: String, required: true},
  content: {type: String, required: true},
  is_read: {type: Boolean, default: false},
  created_at:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Notification', notificationModel, 'notification');
