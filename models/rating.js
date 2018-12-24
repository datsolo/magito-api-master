'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingModel = new Schema({
    // nguoi duoc danh gia
    account: { type: Schema.ObjectId, ref: 'Account' },
    // nguoi danh gia
    reviewer: { type: Schema.ObjectId, ref: 'Account' },
    ratingValue: {type: Number, required: true, enum: [1,2,3,4,5]},
    review: {type: String, required: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Rating', ratingModel);
