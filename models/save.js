'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saveModel = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'Account'},
    blog_id: {type: Schema.ObjectId, ref: 'Blog'},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Save', saveModel, 'save');
