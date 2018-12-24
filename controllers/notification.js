var Notification = require("../models/notification");
var Boom = require('boom');

var perPage = 10;

exports.list = (req, h) => {
    var current_page = parseInt(req.query["page"]) || 1;
    
    if(!req.query["account"]) return Boom.badData("Account ID is missing");

    return Notification.find({ account_id: req.query["account"] })
    .skip(perPage * current_page - perPage)
    .limit(perPage)
    .exec()
    .then(notifications => {
        return Notification.count({ account_id: req.query["account"] }).exec().then(count => {
            return {
                notifications: notifications,
                current: current_page,
                pages: Math.ceil(count / perPage)
            };
        });
    })
    .catch(err => {
        return Boom.boomify(err, { statusCode: 422 });
    });
};

exports.get = (req, h) => {
    return Notification.findById(req.params.id)
        .exec()
        .then(notification => {
            if (!notification) return { message: "Notification not Found" };
            notification.is_read = true;

            return notification.save().then(notification => {
                return {notification};
            })
        })
        .catch(err => {
            return Boom.boomify(err, { statusCode: 422 });
        });
};

exports.empty = (req, h) => {
    return Notification.remove({}, function(err, result) {
        if (err) return { dberror: err };
        return { success: true };
    })
    .then(data => {
        return { message: "Notification empty successfully" };
    })
    .catch(err => {
        return { err: err };
    });
};
