'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receipientModel = new Schema({
  account_id: {type: Schema.ObjectId, ref: 'Account'},
  message_id: {type: Schema.ObjectId, ref: 'Message'},
  is_read: {type: Boolean, default: false},
  created_at:{type: Date, default: Date.now}
});

module.exports = mongoose.model('Receipient', receipientModel, 'receipient');
