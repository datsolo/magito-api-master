'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberModel = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true, seed: String },
  token: { type: String, ref: 'Account', required: true },
  os: { type: String, required: true },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscriber', subscriberModel);
