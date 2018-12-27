'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogModel = new Schema({
    user: {type: Schema.ObjectId, ref: 'Account'},
    content: {type: String, required: true},
    hastag: {type: Schema.ObjectId, ref: 'Hastag'},
    like: [{type: Schema.ObjectId, ref: 'Account'}],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Blog', blogModel, 'blog');