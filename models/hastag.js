'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hastagModel = new Schema({
    content: {type: String, required: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Hastag', hastagModel, 'hastag');