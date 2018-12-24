var Order =  require('../models/order');
var Boom=  require('boom');
var Pusher = require('pusher');


exports.skills = (req, h) => {
    return ['body','foot','clean','washing','spa','cooking'];
}
