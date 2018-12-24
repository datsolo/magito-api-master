var Subscriber = require('../models/subscriber');
var Account = require('../models/account');
var Boom = require('boom');

const perPage = 10;

// get all subscriber (may be paginate)
exports.list = (req, h) => {
	var query = {};
	for (var key in req.query) { //could also be req.query and req.params
		if(key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
	}
	var current_page  = req.query['page'] || 1;

	return Subscriber.find(query).populate('account').skip((perPage*current_page)-perPage).limit(perPage).exec().then((subscribers) => {
		return Subscriber.count(query).exec().then(count => {
			return { subscribers: subscribers, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
		})	
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 422 });
	});
}

// get tokens of many device which suitable conditional
exports.getTokensByFilter = (req, h) => {
	var query = {device:{}, account:{}};
	var device_fields = ['os'];
	var account_fields = ['type', 'state'];
	for (var key in req.query) { //could also be req.query and req.params
		if(device_fields.indexOf(key)>=0) {
			query.device[key] =  (req.query[key] != '') ? req.query[key] : null;
		}
		if(account_fields.indexOf(key)>=0) {
			query.account[key] = (req.query[key] != '') ? req.query[key] : null;
		}
	}

	return Subscriber.find(query.device).populate({
		path: 'account',
		match: query.account
	}).select({ "token": 1, "_id": 0})
		.exec().then((subscribers) => {
			var temp =  subscribers.map(subscriber => {if(subscriber.account!= null) return subscriber.token})
			var tokens = temp.filter(function(n){ return n != null });
			return {tokens};
		}).catch((err) => {

			return Boom.boomify(err, { statusCode: 422 });

		});
}

// /**
//  * Get Subscriber by ID
//  */
// exports.get = (req, h) => {

// 	return Subscriber.findById(req.params.id)
// 		.populate('worker')
// 		.exec().then((subscriber) => {

// 			if (!subscriber) return { message: 'Subscriber not Found' };

// 			return { subscriber: subscriber };

// 		}).catch((err) => {

// 			return { err: err };

// 		});
// }

/**
 * POST a Subscriber
 */
exports.create = (req, h) => {

	const subscriberData = {
		account: req.payload.account,
		token: req.payload.token,
		os: req.payload.os,
	};

	return Subscriber.create(subscriberData).then((subscriber) => {
		return { message: "Subscriber created successfully", subscriber: subscriber };

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

/**
 * Delete Subscriber by ID
 */
exports.remove = (req, h) => {

	return Subscriber.findById(req.params.id).exec().then((subscriber) => {
		if (!subscriber) return Boom.badData('Subscriber not found');

		return subscriber.remove().then((data) => {

			//Subscriber.remove({worker: req.params.id}).exec();
			return { message: 'Remove successfuly' };

		}).catch((err) => {

			return Boom.boomify(err, { statusCode: 422 });

		});

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}
//empty subscriber =
exports.empty = (req, h) => {

	return Subscriber.remove({}, function (err, result) {
		if (err) return { dberror: err };
		return { success: true };
	}).then((data) => {

		return { message: "Subscriber empty successfully" };

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

// get device token by account ID
exports.getToken = (req, h) => {
	return Subscriber.findOne({ account: req.params.account }).exec().then((data) => {
		if(!data) return { message: 'Token not Found'}
		return { token: data.token };
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 422 });
	});
}