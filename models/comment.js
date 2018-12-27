'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentModel = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'Account'},
    blog_id: {type: Schema.ObjectId, ref: 'Blog'},
    content: {type: String, required: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentModel, 'comment');