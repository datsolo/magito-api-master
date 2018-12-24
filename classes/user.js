var method = User.prototype;
var Boom = require('boom');


function User(account) {
    this.data = account;
}

method.create = function(data){
    var Bcrypt = require('bcrypt');
    if(!data.phone && !$data.username){
        throw Boom.badData('Invalid username');
    }
    var accountData = {
		...data,
		password: data.password ? Bcrypt.hashSync(data.password, 10) : '',
		username: data.username ? data.username : data.phone,
		state: data.state ? data.state : 'enabled' ,
	};
    var Account = require('../models/account');
	return Account.create(accountData).then((account) => {

		return account;

	}).catch((err) => {
		//return Boom.badData('Phone number is existed');
		throw Boom.boomify(err, { statusCode: 422 });

	});
}

method.generate_session = function() {
    //luu session
    //clear expired session
    if(!this.data._id){
        throw Boom.unauthorized('Account not found');
    }
    var session_model = require('../models/session');
    session_model.remove({expired:{$lte: (new Date()).toISOString()}});
    //tao session
    var expired = new Date();
    expired.setMonth(expired.getMonth() + 1);
    
    return session_model.create({
        user_id: this.data._id,
        expired: expired.toISOString()
    }).then((session) => {
        session_model = session;
        return ({
                account: this.data,
                message: 'Login successfully',
                sessionid: session._id
        });

    }).catch((err) => {
        throw Boom.boomify(err,{statusCode:404});
    });
};

method.load_user_from_session = function(session_id) {
    // return Boom.unauthorized();
    var session_model = require('../models/session');
    return session_model.findOne({_id:session_id}).exec().then((session) => {                
        if(!session){
            throw new Error('Session expired');
        }
        //load user
        var user_model = require('../models/account');
        return user_model.findOne({_id:session.user_id}).exec().then((account) => {
            // console.log(account);
            if(account){
                //update session expired
                var expired = new Date();
                expired.setMonth(expired.getMonth() + 1);
                session.expired = expired.toISOString();
                session.save();
            }            
            // this.data = account;
            return account;
        });
    }).catch((err) => {
        throw err;
    });
   
};
module.exports = User;