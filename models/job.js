'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Job model store the host jobs
const jobModel = new Schema({
  name: { type: String, required: true },
  host: { type: Schema.ObjectId, ref: 'Account' },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: false },
  description: { type: String, required: false },
  skills: [{
    type: String,
    enum: ['body', 'foot', 'clean', 'washing', 'spa', 'cooking']
  }],
  duration: { type: Number, required: true },
  seat: { type: Number, required: false, min: 1 },
  // date: { type: Date, required: true },
  workers: [
    { type: Schema.ObjectId, ref: 'Account' }
  ],
  price: { type: Number, required: false },
  // create job need address
  coordinates: {
    type: [Number, Number],
    index: '2d'
  },  
  //0: unpublished, 1:published, 2: cancelled
  // if seat reached, job is auto unpublished
  status: { type: Number, required: true },
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Job', jobModel, 'job');
