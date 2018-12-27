// 'use strict';

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const orderModel = new Schema({
//   // type: worker,host
//   type: { type: String, required: true},
//   worker: {type: Schema.Types.ObjectId, ref: 'Account'},
//   host: {type: Schema.Types.ObjectId, ref: 'Account'},
//   job: { type: Schema.Types.ObjectId, ref: 'Job',required: false },
//   start_time: { type: Date, required: true },
//   end_time: { type: Date, required: false },
//   duration: { type: Number, required: true},
//   //pending,confirmed,cancelled,noshow,delivered,rejected
//   status: { type: String, required: true,lowercase: true},
//   //Status change by host, worker
//   changed_by: { type: String, required: false},
//   status_note: { type: String, required: false},

//   host_visible: {type: Boolean, default: true, required: false},
//   worker_visible: {type: Boolean, default: true, required: false},

//   date: { type: Date, default: Date.now, required: true},
//   note: {type: String, required: false},
//   price: { type: Number, required: false },
//   is_confirmed: {type: Boolean, default: false, required: false},
//   created: {
// 	  type:Date,
// 	  default: Date.now
//   }
// });

// module.exports = mongoose.model('Order', orderModel, 'order');
