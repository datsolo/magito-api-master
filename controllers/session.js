var Session = require('../models/session');
var Boom = require('boom');

const perPage = 10;

// get all subscriber (may be paginate)
exports.list = (req, h) => {
    var query = {};
    for (var key in req.query) { //could also be req.query and req.params
        if (key != 'page') req.query[key] !== "" ? query[key] = req.query[key] : null;
    }
    var current_page = req.query['page'] || 1;

    return Session.find(query).skip((perPage * current_page) - perPage).limit(perPage).exec().then((sessions) => {
        return Session.count(query).exec().then(count => {
            return { sessions: sessions, current: parseInt(current_page), pages: Math.ceil(count / perPage) };
        })
    }).catch((err) => {
        return Boom.boomify(err, { statusCode: 422 });
    });
}

exports.get = (req, h) => {
    return Session.findById(req.params.id)
        .populate('user_id')
        .exec().then((session) => {
            if (!session) return { message: 'Session not Found' };
            return { session: session };
        }).catch((err) => {
            return { err: err };
        });
}

exports.update = (req, h) => {
    return Session.findByIdAndUpdate(req.params.id, {...req.payload}, function(err, session) {
		if(err) return Boom.boomify(err,{statusCode:422});
		return { session: session, message: "Session updated successfully" };
	})
}