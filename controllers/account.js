var request = require('request');
var Boom = require('boom');
var Account = require('../models/account');
var Session = require('../models/session');
var User = require('../classes/user');
// var Notification = require('../classes/notification');
var Session = require('../models/session');

// declare number of record per page
const perPage = 10;

// exports.auth = async (req, h) => {
// 	const accesstoken='EMAWfI9fg2QkVI03ftjFrojvX1clbNLe5ZAAjZCrVpN3w1VABLxucxoZAvnK5WXC5hSkZBeYk5zFJU8ikqC2fOUAL6b12ohj0SzyjUboDmIAZDZD';
// 	var accesstoken = req.query.accesstoken;
// 	return new Promise((resolve, reject) => {
// 		return request('https://graph.accountkit.com/v1.0/me/?access_token=' + accesstoken, function (error, response, body) {
// 			if (error) {
// 				return reject(Boom.unauthorized('facebook down'));
// 			}
// 			else if (response.statusCode !== 200) {
// 				return reject(Boom.unauthorized('facebook return incorrect'));
// 			}
// 			else {
// 				var temp = JSON.parse(body);
// 				var phone = temp.phone.national_number;
// 				console.log("temp: "+ phone);

// 		return Account.findOne({ phone: phone }).exec().then(account => {
// 			if (account != null) {
// 				var user = new User(account);
// 				if (account.state === "inactive") {
// 					return user.generate_session().then(result => {
// 						return resolve({ account: null, sessionid: result.sessionid });
// 					});
// 				}
// 				return resolve(user.generate_session());
// 			}
// 			var user = new User();
// 			return user.create({ name: phone, phone: phone }).then((account) => {
// 				var user = new User(account);
// 				return user.generate_session().then(result => {
// 					return resolve({ account: null, sessionid: result.sessionid });
// 				});
// 			});
// 		}).catch((err) => {
// 			return reply(Boom.badImplementation());
// 			return reject(Boom.boomify(err, { statusCode: 422 }));
// 		});
// 		}
// 	});
// 	});
// }

exports.login = (req, h) => {
	return Account.findOne({ $or: [{ phone: req.payload.username }, { username: req.payload.username }] }).exec().then((account) => {
		if (!account) {
			return Boom.badData('Invalid username');
		}
		var Bcrypt = require('bcrypt');
		if (!Bcrypt.compareSync(req.payload.password, account.password)) {
			return Boom.badData('Invalid password');
		}
		if (account.state != 'enabled') {
			return Boom.unauthorized('User is blocked or not actived');
		}
		//luu session
		var user = new User(account);
		console.log(user);
		return user.generate_session();
		


	}).catch((err) => {
		//console.log(err);
		return Boom.boomify(err, { statusCode: 404 });

	});
}


exports.list = (req, h) => {

	//TODO Sorting and pagnination
	var query = {};
	var skill_arr = [];
	for (var key in req.query) { //could also be req.query and req.params
		if (key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
	}
	var current_page = req.query['page'] || 1;

	return Account.find(query).skip((perPage * current_page) - perPage).limit(perPage).exec().then((accounts) => {
		return Account.count(query).exec().then(count => {
			return { accounts: accounts, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
		}).catch((err) => {
			return Boom.boomify(err, { statusCode: 422 });
		});
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 422 });
	});
}

/**
 * Get Account by ID
 */
exports.get = (req, h) => {
	return Account.findById(req.params.id).populate('favorite').populate('blacklist').lean().exec().then((account) => {
		if (!account) return { message: 'Account not Found' };
		return account;
	}).then(account => {
		return Session.findOne({ user_id: account._id }).exec().then(session => {
			return { account: account, sessionid: session._id };
		})
	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

/**
 * Get Account by phone
 */
exports.getByPhone = (req, h) => {

	return Account.findOne({ phone: req.params.phone }).exec().then((account) => {

		if (!account) return { message: 'Account not Found' };

		return { account: account };

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}


exports.add = (req, h) => {


	var updateObj = { favourite: Date.now() };

	return Account.findByIdAndUpdate(req.params.id, updateObj).exec().then((account) => {

		if (!account) return { message: 'Account not Found' };

		return { account: account };

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

// exports.remove = (req, h) => {

// 	return Account.findByIdAndUpdate(req.params.id).exec().then((account) => {

// 		if (!account) return { message: 'Account not Found' };

// 		return { account: account };

// 	}).catch((err) => {

// 		return Boom.boomify(err, { statusCode: 422 });

// 	});
// }

/**
 * POST a Account
 * thu2603
 */
exports.create = (req, h) => {

	if (req.payload.type == 'admin' && !req.payload.password) {
		return Boom.badData('Password is required');
	}
	var user = new User();
	return user.create(req.payload).then((account) => {

		return { message: "Account created successfully", account: account };

	}).catch((err) => {
		//return Boom.badData('Phone number is existed');
		return Boom.boomify(err, { statusCode: 422 });

	});
}
//upload avatar
exports.upload = (req, h) => {
	var URL = require('../classes/helper').getRootUrl();
	return Account.findById(req.auth.credentials.user._id).exec().then((account) => {

		if (!account) return { err: 'Account not found' };

		// var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
		var base64Data = req.payload.avatar;
		var extension = null;
		switch (base64Data.charAt(0)) {
			case '/': {
				extension = '.jpg';
				break;
			}
			case 'i': {
				extension = '.png';
				break;
			}
			case 'R': {
				extension = '.gif';
				break;
			}
			default: {
				extension = '.jpg';
				break;
			}
		}

		require("fs").writeFileSync("../img/avatar/" + account._id + extension, base64Data, 'base64');

		var avatar_path = URL + 'img/avatar/' + account._id + extension;
		account.avatar = avatar_path;
		account.save();
		return { account };

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}



/**
 * PUT | Update Account by ID
 * thu2603
 */
exports.update = (req, h) => {
	var data = req.payload;
	if (req.auth.credentials.user.type == 'admin') {
		var user_id = req.params.id;
	} else {
		if (data.type == 'admin') {
			throw Boom.badData('Invalid user type');
		}
		var user_id = req.auth.credentials.user._id;
	}
	return Account.findById(user_id).exec().then((account) => {

		if (!account) throw Boom.badData('Account not found');

		if (data.password) {
			var Bcrypt = require('bcrypt');
			data.password = Bcrypt.hashSync(req.payload.password, 10);
		}
		return account.update(data);
	}).then((data) => {
		return { message: "Account data updated successfully" };
	}).catch((err) => {
		return Boom.boomify(err, { statusCode: 422 });
	});

	// return Account.update({ _id: req.params.id }, { ...req.payload }, function (err, raw) {
	// 	if (err) return Boom.boomify(err, { statusCode: 422 });
	// 	return { message: "Account data updated successfully" };
	// })
}



/**
 * PUT | Update Account by ID
 */
// exports.status = (req, h) => {
// 	return Account.findById(req.auth.credentials.user._id).exec().then((account) => {
// 		if (!account) return { err: 'Account not found' };
// 		account.status = req.payload.status;
// 		return account.save().then((account) => {
// 			var data = {
// 				pusher: {
// 					event: 'account-change-status',
// 					content: 'Change status successfully!'
// 				},
// 				firebase: {
// 					title: 'Change status!',
// 					body: `Account ${account._id} just has changed status`,
// 				}
// 			}
// 			Notification.notify(data, account._id);

// 			return { account };
// 		}).catch((err) => {
// 			return Boom.boomify(err, { statusCode: 422 });
// 		});

// 	});
// }

/**
 * Delete Account by ID
 */
exports.remove = (req, h) => {

	return Account.findById(req.params.id).exec().then((account) => {
		if (!account) return Boom.badData('Account not found');

		return account.remove().then((data) => {
			return { message: 'Remove successfuly' };
		}).catch((err) => {

			return Boom.boomify(err, { statusCode: 422 });

		});

	}).catch((err) => {

		return Boom.boomify(err, { statusCode: 422 });

	});
}

exports.search = (req, h) => {
	var type_query = req.query.type || ['admin', 'host', 'worker'];
	if (req.query.keyword !== '') {
		return Account.find({ name: { $regex: req.query.keyword, $options: 'i' }, type: { $in: type_query } }).exec().then((accounts) => {
			if (!accounts) return Boom.badData('No result');
			return { accounts }
		}).catch((err) => {
			return Boom.boomify(err, { statusCode: 422 });
		});
	} else {
		return { accounts: [] }
	}
}

// add each account to favorite list
// exports.addFavorite = (req, h) => {
// 	var account_id = (req.auth.credentials.user.type == 'admin') ? req.payload.current_id : req.auth.credentials.user._id;
// 	return Account.findById(account_id).exec().then(account => {
// 		if(account.blacklist.indexOf(req.payload.favorite_account) >= 0) {
// 			account.blacklist.pull(req.payload.favorite_account);
// 		}
// 		if(account.favorite.indexOf(req.payload.favorite_account) < 0) {
// 			account.favorite.push(req.payload.favorite_account);
// 			return account.save().then(result => {
// 				return {account: result}
// 			});
// 		}
// 		return Boom.badData("This account already added in favorite list");
// 	}).catch(err => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// exports.removeFavorite = (req, h) => {
// 	var account_id = (req.auth.credentials.user.type == 'admin') ? req.payload.current_id : req.auth.credentials.user._id;
// 	return Account.findByIdAndUpdate(account_id, {$pull: {favorite: req.payload.favorite_account}}, {new: true}, function (err, account) {
// 		if (err) return Boom.boomify(err, { statusCode: 422 });
// 		return {account};
// 	})
// }

// add each account to black list
// exports.addToBlackList = (req, h) => {
// 	var account_id = (req.auth.credentials.user.type == 'admin') ? req.payload.current_id : req.auth.credentials.user._id;
// 	return Account.findById(account_id).exec().then(account => {
// 		if(account.favorite.indexOf(req.payload.blacklist_account) >= 0) {
// 			account.favorite.pull(req.payload.blacklist_account);
// 		}
// 		if(account.blacklist.indexOf(req.payload.blacklist_account) < 0) {
// 			account.blacklist.push(req.payload.blacklist_account);
// 			return account.save().then(result => {
// 				return {account: result}
// 			});
// 		}
// 		return Boom.badData("This account already added in black list");
// 	}).catch(err => {
// 		return Boom.boomify(err, { statusCode: 422 });
// 	});
// }

// exports.removeFromBlackList = (req, h) => {
// 	var account_id = (req.auth.credentials.user.type == 'admin') ? req.payload.current_id : req.auth.credentials.user._id;
// 	return Account.findByIdAndUpdate(account_id, {$pull: {blacklist: req.payload.blacklist_account}}, {new: true}, function (err, account) {
// 		if (err) return Boom.boomify(err, { statusCode: 422 });
// 		return {account};
// 	})
// }

// exports.updateLocation = (req, h) => {
// 	return Session.findOne({user_id: req.params.id}).exec().then(session => {
// 		session.coordinates = new Array(req.payload.lat, req.payload.lng);
// 		return session.save().then(session => {
// 			return {session};
// 		})
// 	}).catch(err => {
// 		return Boom.badData("Not found!");
// 	})
// }