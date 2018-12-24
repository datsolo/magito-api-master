var request = require('request');
var Boom = require('boom');
var Rating = require('../models/rating');

// declare number of record per page
const perPage = 10;

exports.list = (req, h) => {
    var current_page = req.query['page'] || 1;
    var account_id = req.query['account'];

    return Rating.find({account: account_id}, null, {sort: {created: -1}}).
        skip((perPage*current_page)-perPage).limit(perPage).exec().then((ratings) => {
        return Rating.count({account: account_id}).exec().then(count => {
            return {ratings: ratings, current: current_page, pages: Math.ceil(count/perPage)};
        })
    })
}

exports.getRatingValue = (req, h) => {
    return Rating.find({account: req.query['account']}).exec().then(ratings => {
        var sum = 0;
        var count = 0;

        ratings.map(rating => {
            sum += rating.ratingValue;
            count++;
        });

        return { ratingValue: (sum/count).toFixed(1) }
    }).catch(err => {
        return Boom.boomify({err, statusCode: 422});
    })
}

exports.create = (req, h) => {
    return Rating.findOne({account: req.payload.account, reviewer: req.auth.credentials.user._id}).exec().then(rating => {
        if(rating) {
            rating.ratingValue = req.payload.ratingValue;
            rating.review = req.payload.review;
            return rating.save().then(rating => {
                return {rating: rating, message: "Update rating successfully"}
            })
        } else {
            return Rating.create({
                account: req.payload.account, 
                reviewer: req.auth.credentials.user._id,
                ratingValue: req.payload.ratingValue,
                review: req.payload.review,
            }).then(rating => {
                return {rating: rating, message: "Create rating successfully"}
            })
        }
    })
}

exports.remove = (req, h) => {
    return Rating.remove({_id: req.params.id}, (err) => {
        if (err) return { dberror: err };
		return { success: true };
	}).then((data) => {
		return { message: "Rating remove successfully" };
	}).catch((err) => {
		return Boom.boomify({err, statusCode: 422});
	});
}

exports.removeByAccount = (req, h) => {
    return Rating.remove({account: req.query['account']}, (err) => {
        if (err) return { dberror: err };
		return { success: true };
	}).then((data) => {
		return { message: "Rating of account empty successfully" };
	}).catch((err) => {
		return Boom.boomify({err, statusCode: 422});
	});
}

exports.empty = (req, h) => {
    return Rating.remove({}, (err) => {
        if (err) return { dberror: err };
		return { success: true };
	}).then((data) => {
		return { message: "Rating empty successfully" };
	}).catch((err) => {
		return Boom.boomify({err, statusCode: 422});
	});
}