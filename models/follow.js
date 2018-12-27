'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followModel = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'Account'},
    followed_id: {type: Schema.ObjectId, ref: 'Account'},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Follow', followModel, 'follow');