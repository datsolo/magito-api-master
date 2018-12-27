// var Order = require('../models/order');
// var Boom = require('boom');
// var Notification = require('../classes/notification');
// var Job = require('../models/job');

// const perPage = 10;

// exports.list = (req, h) => {
// 	var query = {};
// 	for (var key in req.query) { //could also be req.query and req.params
// 		if (key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
// 	}
// 	var current_page = req.query['page'] || 1;

// 	return Order.find(query)
// 		.sort({ 'date': 'asc' })
// 		.populate('host')
// 		.populate('worker')
// 		.skip((perPage * current_page) - perPage)
// 		.limit(perPage)
// 		.exec().then((orders) => {
// 			return Order.count(query).exec().then(count => {
// 				return { orders: orders, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
// 			})
// 		}).catch((err) => {
// 			return Boom.boomify(err);
// 		});
// }

// /**
//  * Get Order by ID
//  */
// exports.get = (req, h) => {

// 	return Order.findById(req.params.id)
// 		.populate('host')
// 		.populate('worker')
// 		.exec().then((order) => {

// 			if (!order) return { message: 'Order not Found' };

// 			return { order: order };

// 		}).catch((err) => {

// 			return Boom.boomify(err);

// 		});
// }


// /**
//  * POST a Order (admin)
//  */
// exports.create = (req, h) => {
// 	return Job.findById(req.payload.job).exec().then((job) => {
// 		if (!job) return Boom.badData('Job not found');

// 		const orderData = {
// 			type: req.payload.type,
// 			worker: req.payload.worker,
// 			host: req.auth.credentials.user._id,
// 			duration: job.duration,
// 			start_time: job.start_time,
// 			end_time: job.end_time,
// 			date: job.date,
// 			status: 'PENDING',
// 			status_note: req.payload.status_note,
// 			price: job.price,
// 			job: req.payload.job
// 		};

// 		return Order.create(orderData).then((order) => {
// 			// Notify.trigger('worker-job-invite', {
// 			// 	"_id": order._id
// 			// });
// 			return { message: "Order created successfully", order: order };
// 		});
// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});

// }

// exports.host_create = (req, h) => {
// 	return Job.findById(req.payload.job).exec().then((job) => {
// 		if (!job) return Boom.badData('Job not found');

// 		return Order.findOne({ job: job._id, worker: req.payload.worker }).exec().then((order) => {
// 			if (!order) {
// 				const orderData = {
// 					type: 'host',
// 					worker: req.payload.worker,
// 					host: req.auth.credentials.user._id,
// 					duration: job.duration,
// 					start_time: job.start_time,
// 					end_time: job.end_time,
// 					date: job.date,
// 					status: 'PENDING',
// 					status_note: req.payload.status_note,
// 					price: job.price,
// 					job: req.payload.job
// 				};

// 				return Order.create(orderData).then((order) => {
// 					var data = {
// 						pusher: {
// 							event: 'worker-job-invite',
// 							content: `Host ${req.auth.credentials.user._id} invited you a new job!`
// 						},
// 						firebase: {
// 							title: 'Receive new job invited!',
// 							body: `Host ${req.auth.credentials.user._id} invited you a new job!`,
// 						}
// 					}
// 					Notification.notify(data, req.payload.worker);

// 					// Notify.trigger(`private-${req.payload.worker}`, 'worker-job-invite', {
// 					// 	"_id": order._id,
// 					// 	"message":`You just received an invite from host ${req.auth.credentials.user._id}`
// 					// });
// 					return { message: "Order created successfully", order: order };
// 				});

// 			} else {
// 				return Boom.badData("Order is existed!");
// 			}
// 		});
// 	}).catch((err) => {
// 		return Boom.boomify(err);
// 	});

// }

// // worker apply job
// exports.worker_create = (req, h) => {
// 	return Job.findById(req.payload.job).exec().then(job => {
// 		if (!job) throw Boom.badData('Job not found');
// 		return Order.find({job: job._id, status: 'confirmed'}).exec().then(orders => {
// 			if(orders.length === job.seat) throw Boom.badData('Job is full seat. You can not apply!');
// 			return job;
// 		})
// 	}).then(job => {	
// 		return Order.find({worker: req.auth.credentials.user._id, date: job.date}).exec().then(orders => {
// 			// convert start_time and duration to minutes number format => get end_time
// 			var job_start_time = job.start_time.getUTCHours()*60 + job.start_time.getMinutes(); 
// 			var job_end_time = job_start_time + parseInt(job.duration);

// 			orders.some(order => {
// 				// convert start_time and duration to minutes number format => get end_time
// 				var order_start_time = order.start_time.getUTCHours()*60 + order.start_time.getMinutes(); 
// 				var order_end_time = order_start_time + parseInt(order.duration);

// 				if((order_start_time <= job_start_time && job_start_time <= order_end_time) 
// 						|| (job_start_time <= order_start_time && order_start_time <= job_end_time)) {
// 					throw Boom.badData('Order bị trùng thời gian với các order khác');
// 				}
// 			});
// 			return job;
// 		})
// 	}).then(job => {		
// 		return Order.findOne({ job: job._id, worker: req.auth.credentials.user._id }).exec().then(order => {
// 			//tim order neu trung
// 			if (!order) {
// 				const orderData = {
// 					type: 'worker',
// 					host: job.host,
// 					worker: req.auth.credentials.user._id,
// 					duration: job.duration,
// 					start_time: job.start_time,
// 					end_time: job.end_time,
// 					date: job.date,
// 					status: 'PENDING',
// 					status_note: req.payload.status_note,
// 					price: job.price,
// 					job: job._id
// 				};
// 				return Order.create(orderData).then((order) => {
// 					var data = {
// 						pusher: {
// 							event: 'host-job-apply',
// 							content: `Worker ${req.auth.credentials.user._id} applied your new job!`
// 						},
// 						firebase: {
// 							title: 'New worker applied!',
// 							body: `Worker ${req.auth.credentials.user._id} applied your new job!`,
// 						}
// 					}
// 					Notification.notify(data, job.host);
// 					// Notify.trigger(`private-${job.host}`, 'host-job-apply', {
// 					// 	"_id": order._id,
// 					// 	"message":`Worker ${req.auth.credentials.user._id} just applied your job!`
// 					// });
// 					return { message: "Order created successfully", order: order };
// 				})
// 			} else {
// 				return Boom.badData("Order is existed!");
// 			}
// 		});
// 	})
// 	.catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});

// }

// // worker accept
// exports.worker_update = (req, h, request_name) => {
// 	return Order.findById(req.payload.id).populate('host').exec().then((order) => {

// 		if (!order || order.worker.toString() != req.auth.credentials.user._id.toString()) {
// 			throw Boom.badData('Order not found');
// 		}
// 		if (order.status == 'cancelled' || order.status == 'rejected') {
// 			throw Boom.badData('Order has been rejected or cancelled');
// 		}
// 		//accept neu la dc host invite
// 		if (order.type == 'host' && order.status == 'pending') {
// 			order.is_confirmed = true;
// 			order.status = 'confirmed';
// 			order.changed_by = req.auth.credentials.user._id;
// 			return order.save().then(order => {
// 				var data = {
// 					pusher: {
// 						event: 'host-order-accept',
// 						content: `Worker ${req.auth.credentials.user._id} accepted your invitation for a new job!`
// 					},
// 					firebase: {
// 						title: 'Worker accepted your invitation!',
// 						body: `Worker ${req.auth.credentials.user._id} accepted your invitation for a new job!`,
// 					}
// 				}
// 				Notification.notify(data, order.host);
// 				// Notify.trigger(`private-${order.host}`, 'host-order-accept', {
// 				// 	"_id": order._id,
// 				// 	"message":`Worker ${order.worker} is accepted your invite!`
// 				// });
// 				return { message: "Order is accepted", order: order };
// 			});
// 		}
// 		return { message: "You cannot accept this order" };
// 	}).catch((err) => {
// 		return Boom.boomify(err);
// 	});
// }

// //host accept order
// exports.host_update = (req, h, request_name) => {
// 	return Order.findById(req.payload.id).exec().then((order) => {

// 		if (!order || order.host.toString() != req.auth.credentials.user._id.toString()) {
// 			throw Boom.badData('Order not found');
// 		}
// 		if (order.status == 'cancelled' || order.status == 'rejected') {
// 			throw Boom.badData('Order has been rejected or cancelled');
// 		}
// 		//accept neu la dc worker apply
// 		if (order.type == 'worker' && order.status == 'pending') {
// 			order.is_confirmed = true;
// 			order.status = 'confirmed';
// 			order.changed_by = req.auth.credentials.user._id;
// 			return order.save().then(order => {
// 				var data = {
// 					pusher: {
// 						event: 'worker-order-accept',
// 						content: `Host ${req.auth.credentials.user._id} accepted your application for a new job!`
// 					},
// 					firebase: {
// 						title: 'Host accepted your application!',
// 						body: `Host ${req.auth.credentials.user._id} accepted your application for a new job!`,
// 					}
// 				}
// 				Notification.notify(data, order.worker);
// 				// Notify.trigger(`private-${order.worker}`, 'worker-order-accept', {
// 				// 	"_id": order._id,
// 				// 	"message":`Host ${order.host} is accepted your apply!`
// 				// });
// 				return { message: "Order is accepted", order: order };
// 			});
// 		}
// 		return { message: "You can not accept this order" };

// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// /**
//  * PUT | Update Order by ID for admin
//  */
// exports.update = (req, h) => {

// 	return Order.findByIdAndUpdate(req.params.id, req.payload, {new: true})
// 	.populate('host')
// 	.populate('worker')
// 	.lean()
// 	.exec()
// 	.then(order => {
// 		return {order: order, message: "Order update successfully"}
// 	})
// 	.catch(err => {
// 		return Boom.boomify(err);
// 	})
// }

// //host reject or cancel order
// exports.host_cancel = (req, h, request_name) => {
// 	return Order.findById(req.payload.id).exec().then((order) => {

// 		if (!order || order.host.toString() != req.auth.credentials.user._id.toString()) {
// 			throw Boom.badData('Order not found');
// 		}
// 		//tu huy
// 		if (order.type == 'host' || order.status === 'confirmed') {
// 			order.status = 'cancelled';

// 			var data = {
// 				pusher: {
// 					event: 'worker-order-cancel',
// 					content: `Order in job ${order.job} has been cancelled by host`
// 				},
// 				firebase: {
// 					title: 'Host cancelled!',
// 					body: `Order in job ${order.job} has been cancelled by host`,
// 				}
// 			}
// 			Notification.notify(data, order.worker);
// 			// Notify.trigger(`private-${order.worker}`,'worker-order-cancel', {
// 			// 	"_id": order._id,
// 			// 	"message":`Order in job ${order.job} has been cancelled by host`
// 			// });
// 		} else {
// 			if(order.status === 'pending') {
// 				order.status = 'rejected';
				
// 				var data = {
// 					pusher: {
// 						event: 'worker-order-reject',
// 						content: `Order in job ${order.job} has been rejected by host`
// 					},
// 					firebase: {
// 						title: 'Host cancelled!',
// 						body: `Order in job ${order.job} has been rejected by host`,
// 					}
// 				}
// 				Notification.notify(data, order.worker);
// 				// Notify.trigger(`private-${order.worker}`,'worker-order-reject', {
// 				// 	"_id": order._id,
// 				// 	"message":`Your apply in job ${order.job} has been rejected by host`
// 				// });
// 			}
// 		}
// 		order.changed_by = req.auth.credentials.user._id;
// 		return order.save();
// 	}).then(order => {
// 		return order;
// 	})
// 		.catch((err) => {
// 			return Boom.boomify(err);
// 		});
// }

// //worker cancel
// exports.worker_cancel = (req, h, request_name) => {
// 	return Order.findById(req.payload.id).exec().then((order) => {

// 		if (!order || order.worker.toString() != req.auth.credentials.user._id.toString()) {
// 			throw Boom.badData('Order not found');
// 		}
// 		//tu huy
// 		if (order.type == 'worker' || order.status === 'confirmed') {
// 			order.status = 'cancelled';

// 			var data = {
// 				pusher: {
// 					event: 'host-order-cancel',
// 					content: `Order of job ${order.job} has been cancelled by worker!`
// 				},
// 				firebase: {
// 					title: 'Host cancelled!',
// 					body: `Order of job ${order.job} has been cancelled by worker!`,
// 				}
// 			}
// 			Notification.notify(data, order.host);
// 			// Notify.trigger(`private-${order.host}`,'host-order-cancel', {
// 			// 	"_id": order._id,
// 			// 	"message":`Order of job ${order.job} has been cancelled by worker!`
// 			// });
// 		} else {
// 			if(order.status === 'pending') {
// 				order.status = 'rejected';

// 				var data = {
// 					pusher: {
// 						event: 'host-order-reject',
// 						content: `Order of job ${order.job} has been rejected by worker!`
// 					},
// 					firebase: {
// 						title: 'Host cancelled!',
// 						body: `Order of job ${order.job} has been rejected by worker!`,
// 					}
// 				}
// 				Notification.notify(data, order.host);
// 				// Notify.trigger(`private-${order.host}`,'host-order-reject', {
// 				// 	"_id": order._id,
// 				// 	"message":`Order of job ${order.job} has been rejected by worker!`
// 				// });
// 			}
// 		}
// 		order.changed_by = req.auth.credentials.user._id;
// 		return order.save();
// 	}).then(order => {
// 		return order;
// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// // update end time 
// exports.finishOrder = (req, h) => {
// 	return Order.findById(req.payload.id).populate('host').populate('worker').exec().then(order => {
// 		if(req.payload.end_time <= order.start_time) {
// 			return Boom.badData("End time must be greater than start time");
// 		}
// 		order.end_time = req.payload.end_time;
// 		order.duration = (new Date(req.payload.end_time) - new Date(order.start_time))/(1000*60);
// 		order.status = 'delivered';
// 		return order.save().then(order => {
// 			return {order};
// 		})
// 	})
// }

// /**
//  * Delete Order by ID
//  */
// exports.remove = (req, h) => {

// 	return Order.findById(req.params.id).exec().then((order) => {
// 		if (!order) return Boom.badData('Order not found');

// 		return order.remove().then((data) => {

// 			//Order.remove({worker: req.params.id}).exec();
// 			return { message: 'Remove successfuly' };

// 		}).catch((err) => {

// 			return Boom.boomify(err);

// 		});

// 	}).catch((err) => {

// 		return Boom.boomify(err);

// 	});
// }
// //empty order =
// exports.empty = (req, h) => {

// 	return Order.remove({}, function (err, result) {
// 		if (err) return { dberror: err };
// 		return { success: true };
// 	}).then((data) => {

// 		return { message: "Order empty successfully" };

// 	}).catch((err) => {

// 		return Boom.boomify(err);

// 	});
// }

// /**
//  * PUT | Update Order status by ID
//  */
// exports.updateStatus = (req, h) => {

// 	return Order.findById(req.params.id).exec().then((order) => {

// 		if (!order) return { err: 'Order not found' };

// 		order.status = req.payload.status;

// 		return order.save().then((order) => {

// 			return { order };

// 		}).catch((err) => {

// 			return Boom.boomify(err);

// 		});

// 	});
// }

// exports.getHistory = (req, h) => {
// 	var current_time = new Date();
// 	var current_page = parseInt(req.query['page']) || 1;

// 	if(req.auth.credentials.user.type === 'worker') {
// 		return Order.find({ 
// 			worker: req.auth.credentials.user._id,
// 			is_confirmed: true,
// 			end_time: {$lte: current_time}
// 		}).skip((perPage*current_page)-perPage).limit(perPage).exec().then(orders => {
// 			return Order.count({ 
// 				worker: req.auth.credentials.user._id,
// 				is_confirmed: true,
// 				end_time: {$lte: current_time}
// 			}).exec().then(count => {
// 				return {orders: orders, current: current_page, pages: Math.ceil(count / perPage)};
// 			})
// 		})
// 		.catch(err => {
// 			return Boom.boomify(err);
// 		});
// 	} else if(req.auth.credentials.user.type === 'host') {
// 		return Job.find({host: req.auth.credentials.user._id}).distinct('_id')
// 		.then(jobs => {
// 			return Order.find({
// 				job: {$in: jobs},
// 				is_confirmed: true, 
// 				end_time: {$lte: current_time}
// 			}).skip((perPage*current_page)-perPage).limit(perPage).exec().then(orders => {
// 				return Order.count({ 
// 					job: {$in: jobs},
// 					is_confirmed: true, 
// 					end_time: {$lte: current_time}
// 				}).exec().then(count => {
// 					return {orders: orders, current: current_page, pages: Math.ceil(count / perPage)};
// 				})
// 			})
// 		})
// 	}
// }
