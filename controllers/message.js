// var Message = require('../models/message.js');
// var Receipient = require('../models/message-receipient');
// var Boom = require('boom');
// var firebase = require('../config').firebase;

// const perPage = 10;

// // get all messages
// exports.list = (req, h) => {
// 	var query = {};
// 	for (var key in req.query) { //could also be req.query and req.params
// 		if (key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
// 	}
// 	var current_page = req.query['page'] || 1;

// 	return Message.find(query).skip((perPage * current_page) - perPage).limit(perPage).exec().then((messages) => {
// 		return Message.count(query).exec().then(count => {
// 			return { messages: messages, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
// 		})
// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// exports.create = (req, h) => {
// 	var body = req.payload.body;
//     var title = req.payload.title;
//     var accounts = req.payload.accounts;
//     var tokens = req.payload.tokens;
//     var topic = req.payload.topic;  

//     return firebase.messaging().subscribeToTopic(tokens, topic).then(response => {
//         // See the MessagingTopicManagementResponse reference documentation
//         // for the contents of response.
//         console.log('Successfully subscribed to topic:', response);
//         var message = {
//             notification: {
//                 title: title,
//                 body: body,
//             },
//             topic: topic,
//         };
//         return message;
//     }).then(message => {
//         return firebase.messaging().send(message);
//     }).then(response => {
//         console.log(response);
//         const messageData = {
//             title: title,
//             body: body,
//             topic: topic,
//             read_by: [],
//             fcm_success: true,
//         }
//         return Message.create(messageData);
//     }).then(message => {
//         var receipients = [];
//         accounts.map(account => {
//             receipients.push({
//                 account_id: account,
//                 message_id: message._id,
//             });
//         });
// 		Receipient.create(receipients);
// 		return { message: "Message sent successfully" };
//     })
//     .catch(err => {
//         return Boom.boomify(err, { statusCode: 422 })
//     });
// }

// // get message by id 
// exports.get = (req, h) => {
// 	return Message.findById(req.params.id).lean().exec().then((message) => {
// 		if (!message) return { message: 'Message not Found' };
// 		return {message};
// 	})
// 	.catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// // delete message by id
// exports.remove = (req, h) => {

// 	return Message.findById(req.params.id).exec().then((message) => {
// 		if (!message) return Boom.badData('Account not found');

// 		return message.remove().then((data) => {
// 			return { message: 'Remove successfuly' };
// 		}).catch((err) => {

// 			return Boom.boomify(err, { statusCode: 422 });

// 		});

// 	}).catch((err) => {

// 		return Boom.boomify(err, { statusCode: 422 });

// 	});
// }

// // empty messages
// exports.empty = (req, h) => {

// 	return Message.remove({}, function (err, result) {
// 		if (err) return { dberror: err };
// 		return { success: true };
// 	}).then((data) => {

// 		return { message: "Message empty successfully" };

// 	}).catch((err) => {

// 		return { err: err };

// 	});
// }

// /**
//  * Receipient API
//  */
// exports.getMessageByAccount = (req, h) => {
// 	var current_page = parseInt(req.query['page']) || 1;

// 	// return Receipient.aggregate([
// 	// 	{ $match: { account_id: account_id } },
// 	// 	{ $group: { message_id: "$message_id", is_read: "$is_read" } },
// 	// 	{ $skip: (perPage * current_page) - perPage },
// 	// 	{ $limit: perPage },
// 	// 	{ $sort: {created_at: -1} }
// 	// ])
// 	// .then(messages_arr => {
// 	// 	var messages_id_arr = [];
// 	// 	messages_arr.map(item => {
// 	// 		messages_id_arr.push(item._id);
// 	// 	});
// 	// 	return Message.find({ _id: messages_id_arr }).exec();
// 	// }).then(messages => {
// 	// 	return { messages };
// 	// }).catch(err => {
// 	// 	return Boom.boomify(err, { statusCode: 422 });
// 	// });
// 	var messages = [];
// 	return Receipient.find({account_id: req.auth.credentials.user._id}).select({ "message_id": 1, "is_read": 1, "_id": 0})
// 		.skip((perPage * current_page) - perPage).limit(perPage)
// 		.populate("message_id").sort({created_at: -1}).exec().then(receipients => {
// 		receipients.map(receipient => {
// 			messages.push({
// 				body: receipient.message_id.body,
// 				_id: receipient.message_id._id,
// 				title: receipient.message_id.title,
// 				is_read: receipient.is_read,
// 				created_at: receipient.message_id.created_at,
// 			})
// 		});
// 		return messages;	
// 	}).then(messages => {
// 		return Receipient.count({account_id: req.auth.credentials.user._id}).exec().then(count => {
// 			return {messages: messages, current: current_page, pages: Math.ceil(count/perPage)};
// 		})
// 	}).catch(err => {
// 		return Boom.boomify(err, {statusCode: 422});
// 	})
// }

// exports.getMessageDetailByAccount = (req, h) => {
// 	return Message.findById(req.params.id).lean().exec().then((message) => {
// 		if (!message) return { message: 'Message not Found' };
// 		return Receipient.findOne({account_id: req.auth.credentials.user._id, message_id: message._id}).exec().then(receipient => {
// 			if(!receipient) return Boom.badData("Not found");
// 			receipient.is_read = true;
// 			return receipient.save().then(receipient => {
// 				message.is_read = true;
// 				return {message};
// 			})
// 		})
// 	})
// 	.catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// exports.removeMessageByAccount = (req, h) => {
// 	return Receipient.findOne({account_id: req.auth.credentials.user._id, message_id: req.params.id}).exec().then(receipient => {
// 		if(!receipient) return Boom.badData('Message not found!');
// 		return receipient.remove().then((data) => {
// 			return { message: 'Remove successfuly' };
// 		}).catch((err) => {
// 			return Boom.boomify(err, { statusCode: 422 });
// 		});
// 	})
// }

// exports.emptyMessageByAccount = (req, h) => {
// 	return Receipient.remove({account_id: req.auth.credentials.user._id}, function (err, result) {
// 		if (err) return Boom.badData(err);
// 		return {success: true};
// 	}).then((data) => {
// 		return {  message: "All message removed" };
// 	}).catch((err) => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	})
// }