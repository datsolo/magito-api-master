// var Job = require('../models/job');
// var Account = require('../models/account');
// var Order = require('../models/order');
// var Receipient = require('../models/message-receipient');
// var Message = require('../models/message');
// var Boom = require('boom');
// var Notification = require('../classes/notification');
// var Session = require('../models/session');
// var Helper = require('../classes/helper');

// const perPage = 10;

// exports.list = (req, h) => {
// 	var current_time = new Date();
// 	current_time.setMinutes(current_time.getMinutes() + 10);

// 	var query = {};
// 	for (var key in req.query) { //could also be req.query and req.params
// 		// req.query[key] !== "" ? query[key] = req.query[key] : null;
// 		if (key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
// 	}
// 	var current_page = req.query['page'] || 1;
// 	if (req.auth.credentials.user.type !== 'admin') {
// 		query = {
// 			...query,
// 			start_time: { $gt: current_time } // greater than 10 minutes
// 		}
// 	}

// 	return Job.find(query).skip((perPage * current_page) - perPage).limit(perPage).populate('host').lean().exec().then((jobs) => {
// 		var job_id_array = [];
// 		jobs.forEach(job => {
// 			job_id_array.push(job._id);
// 		});
// 		return Order.find({ job: { $in: job_id_array } }).exec().then(orders => {
// 			jobs.forEach((job) => {
// 				job.confirmed_orders = [];
// 				orders.forEach((order) => {
// 					if (JSON.stringify(order.job) == JSON.stringify(job._id) && order.status === 'confirmed') {
// 						job.confirmed_orders.push(order);
// 					}
// 				});
// 			})
// 			return Job.count(query).exec().then(count => {
// 				return { jobs: jobs, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
// 			})
// 		})
// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// /**
//  *  Get Job History, finished job 
//  */
// exports.getHistory = (req, h) => {
// 	var current_page = parseInt(req.query['page']) || 1;
// 	return Job.find({
// 		host: req.auth.credentials.user._id,
// 		end_time: {
// 			$lte: new Date()
// 		}
// 	}).skip((perPage * current_page) - perPage).limit(perPage).lean().sort({ end_time: -1 }).exec().then(jobs => {
// 		var job_id_array = [];
// 		jobs.forEach(job => {
// 			job_id_array.push(job._id);
// 		});
// 		return Order.find({ job: { $in: job_id_array } }).exec().then(orders => {
// 			jobs.forEach((job) => {
// 				job.confirmed_orders = [];
// 				orders.forEach((order) => {
// 					if (JSON.stringify(order.job) == JSON.stringify(job._id) && order.status === 'confirmed') {
// 						job.confirmed_orders.push(order);
// 					}
// 				});
// 			})
// 			return Job.count({
// 				host: req.auth.credentials.user._id,
// 				end_time: {
// 					$lte: new Date()
// 				}
// 			}).exec().then(count => {
// 				return { jobs: jobs, current: current_page, pages: Math.ceil(count / perPage) };
// 			})
// 		})
// 	})
// }

// /**
//  * Get Job by ID
//  */
// exports.get = (req, h) => {

// 	return Job.findById(req.params.id).populate('host').lean().exec().then((job) => {

// 		if (!job) return { message: 'Job not Found' };

// 		return Order.find({ job: req.params.id }).exec().then((orders) => {
// 			job.orders = orders;
// 			return { job: job };
// 		});

// 	}).catch((err) => {

// 		return Boom.boomify(err, { statusCode: 422 });

// 	});
// }


// /**
//  * POST a Job
//  */
// exports.create = (req, h) => {
// 	var job_id = undefined;
// 	var worker_arr = [];

// 	const jobData = {
// 		name: req.payload.name,
// 		seat: req.payload.seat,
// 		date: req.payload.start_time,
// 		start_time: req.payload.start_time,
// 		end_time: Helper.convertEndTime(req.payload.start_time, req.payload.duration),
// 		host: req.auth.credentials.user._id,
// 		duration: req.payload.duration,
// 		skills: req.payload.skills,
// 		price: req.payload.price,
// 		status: req.payload.status,
// 		coordinates: req.auth.credentials.user.address.coordinates,
// 		blacklist: req.auth.credentials.user.blacklist,
// 	};
// 	if (req.auth.credentials.user.type == 'admin') {
// 		jobData.host = req.payload.host;
// 		jobData.coordinates = req.payload.coordinates;
// 		Account.find({ _id: req.payload.host }).exec().then(account => {
// 			jobData.blacklist = account.blacklist;
// 		})
// 	}

// 	var current_time = new Date();
// 	current_time.setMinutes(current_time.getMinutes() - 30);

// 	return Job.create(jobData).then((job) => {
// 		job_id = job._id;
// 		// find account online, not in blacklist and distance from job less than 5km
// 		return Session.find({
// 			created: {
// 				$lte: current_time
// 			},
// 			user_id: {
// 				$nin: jobData.blacklist
// 			},
// 			coordinates: {
// 				// (5km) base link: https://docs.mongodb.com/manual/tutorial/calculate-distances-using-spherical-geometry-with-2d-geospatial-indexes/
// 				$geoWithin: {
// 					$centerSphere: [jobData.coordinates, 5 / 6378.1]
// 				}
// 			}
// 		}).distinct('user_id');
// 	})
// 		.then(sessions => {
// 			console.log(sessions);
// 			worker_arr = sessions;
// 			return Order.find({ worker: { $in: sessions }, date: jobData.date }).populate('worker');
// 		})
// 		.then((orders) => {
// 			if (orders != []) {
// 				var job_start_time = new Date(jobData.start_time).getTime();
// 				var job_end_time = new Date(jobData.end_time).getTime();

// 				orders.map((order) => {
// 					// convert start_time and duration to minutes number format => get end_time
// 					var order_start_time = new Date(order.start_time).getTime();
// 					var order_end_time = new Date(order.end_time).getTime();

// 					if ((order_start_time <= job_start_time && job_start_time <= order_end_time)
// 						|| (job_start_time <= order_start_time && order_start_time <= job_end_time)) {
// 						if (order.worker.status === 'on' && jobData.skills.indexOf(order.worker)) {
// 							worker_arr.pull(order.worker);
// 						}
// 					}
// 				});
// 			}
// 			return worker_arr;
// 		})
// 		.then(worker_arr => {
// 			var data = {
// 				pusher: {
// 					event: 'worker-job-new',
// 					content: 'There is a new job near you!'
// 				},
// 				firebase: {
// 					title: 'New job!',
// 					body: `Do you want to apply job ${job_id} now?`,
// 					topic: `job-${job_id}`
// 				}
// 			}
// 			// Notification.notify(data, '5b6d16830b5e552e14d6c30c');
// 			Notification.notify(data, worker_arr);
// 			return { message: "Job created successfully" };
// 		})
// 		.catch((err) => {
// 			return Boom.boomify(err, { statusCode: 404 });
// 		});
// }

// /**
//  * PUT | Update Job by ID
//  */
// exports.update = (req, h) => {
// 	return Job.update({ _id: req.params.id }, { ...req.payload }, function (err, raw) {
// 		if (err) return Boom.boomify(err, { statusCode: 422 });
// 		return { message: "Job updated successfully" };
// 	})
// }
// //TODO add socketio to send message to parties
// exports.accept = (req, h) => {

// 	return Job.findById(req.params.id).exec().then((job) => {

// 		if (!job) return { err: 'Job not found' };

// 		job.status = req.payload.status;

// 		job.save(jobData);

// 	}).then((data) => {

// 		return { message: "Job data updated successfully" };

// 	}).catch((err) => {

// 		return Boom.boomify(err, { statusCode: 404 });

// 	});
// }


// /**
//  * Delete Job by ID
//  */
// exports.remove = (req, h) => {

// 	return Job.findById(req.params.id).exec().then((job) => {
// 		if (!job) return Boom.badData('Job not found');

// 		return job.remove().then((data) => {
// 			Order.find({ job: job._id, status: { $in: ['pending', 'confirmed'] } }).distinct('worker').then(workers => {

// 				var data = {
// 					pusher: {
// 						event: 'worker-job-cancel',
// 						content: `The job ${job._id} has been cancelled!`
// 					},
// 					firebase: {
// 						title: 'Job cancelled!',
// 						body: `The job ${job._id} has been cancelled!`,
// 						topic: `job-cancel-${job._id}`
// 					}
// 				}
// 				Notification.notify(data, workers);
// 				// Notify.trigger(`private-${worker_id}`, 'worker-job-cancel', {
// 				// 	"_id": job._id,
// 				// 	"message": `The job ${job._id} has been cancelled!`
// 				// });
// 			});

// 			return { message: 'Remove successfuly' };
// 		});
// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// exports.empty = (req, h) => {

// 	return Job.remove({}, function (err, result) {
// 		if (err) return { dberror: err };
// 		return { success: true };
// 	}).then((data) => {

// 		return { message: "Job empty successfully" };

// 	}).catch((err) => {

// 		return { err: err };

// 	});
// }

// exports.cancel = (req, h) => {
// 	return Job.findByIdAndUpdate(req.payload.id, { status: 2 }, { new: true }, (err, job) => {
// 		if (err) throw Boom.badData('Error when update job');
// 		return job;
// 	}).then(job => {
// 		return Order.updateMany({ job: job._id }, { status: 'cancelled' }, (err, raw) => {
// 			return { message: "Job cancelled successfully" };
// 		});
// 	}).catch(err => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	})
// }
