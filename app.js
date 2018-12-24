'use strict';
const fs = require('fs');
const Guid = require('guid');
const Hapi = require('hapi');
const mongoose = require('mongoose');
const request = require('request');
require('dotenv').load();
// const config= require('./config');

// const AccountController =  require('./controllers/account');
const MongoDBUrl = 'mongodb://localhost:27017/blog';

const server = Hapi.server({
    port: parseInt(process.env.PORT, 10) || 3000,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['sessionid','cache-control', 'x-requested-with']
        },
        validate: {
            failAction: async (request, h, err) => {
              if (process.env.NODE_ENV === 'production') {
                  var Boom = require('boom');
                throw Boom.badRequest(`Invalid request payload input`);
              } else {
                throw err;
              }
            }
          }
    }
});

/*
var socket_server = Hapi.server({
    port: 8080,
    host: 'localhost'
});
*/
/*socket*/
// global.io = require('socket.io')(server.listener);
// var online_count = 0;

// //middleware
// io.use((socket, next) => {
//     let token = socket.handshake.query.token;
//     if ((token)) {
//         console.log(token);
//         return next();
//     }
//     //return next();
//     return next(new Error('authentication error'));
// });
// io.on("connection", function (socket,data) {
// 	online_count++;
//     socket.emit('test',socket.id+' '+online_count);
//     io.sockets.emit('online_count',online_count);
//     socket.on("disconnect",function(){
//         online_count--;
//     });
//     socket.on('get_online_count',function(){
//         socket.emit('online_count',online_count);
//     });
// })


//middleware
server.ext('onRequest', function (request, reply) {
    return reply.continue;
});

//auth
const validate = async (request, username, password, h) => {
    const isValid = 1;//await Bcrypt.compare(password, user.password);
    const credentials =  {id: '1', name: 'duong' };

    return { isValid, credentials };
};

const scheme = function (server, options) {
    return {
        api: {
            settings: {
                x: 5
            }
        },
        authenticate: function (request, h) {
            var Boom=  require('boom');
            const session_id = request.headers.sessionid;
            
            if (!session_id) {
                throw Boom.unauthorized(null, 'Custom');
            }
            var User = require('./classes/user');
            var account = new User();
            return account.load_user_from_session(session_id).then((acc)=>{
                // console.log(acc);
                return h.authenticated({ credentials: { user:acc,scope:[acc.type] } });
            }).catch((err) => {
                // console.log(err);
                return Boom.boomify(err,{statusCode:401});
            });
        }
    };
};

server.auth.scheme('oo2', scheme);
server.auth.strategy('default', 'oo2');
server.auth.default({
    strategy: 'default'
});


server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {
        console.log('onrequest');
        return 'Welcome to datsolo blog, no action here';
    }
});

/**
 * thupa2603
 * get app config
 */
// server.route({
//     method:'GET',
//     path:'/config',
//     handler:function(request,h) {
//         let config = {}
//         //LOAD JSON
    
//         if (process.env.NODE_ENV === undefined || process.env.NODE_ENV == null || process.env.NODE_ENV == 'development') {
//             config = JSON.parse(fs.readFileSync('./config/config.development.json', 'utf8'))
    
//         } else {
//             if (process.env.NODE_ENV == 'production') {
//                 config = JSON.parse(fs.readFileSync('./config/config.production.json', 'utf8'))
//             }
//         }
//         //LOAD FROM ENV VARIABLES
//         config.connection_string = process.env.connection_string
//         config.port = process.env.PORT || config.port
    
//         return {config}
//     }
// });

/**
 * thupa2603
 * set app config 
 */
// server.route({
//     method:'POST',
//     path:'/config',
//     handler: function(request,h) {
//         if (process.env.NODE_ENV === undefined || process.env.NODE_ENV == null || process.env.NODE_ENV == 'development') {
//             fs.writeFile('./config/config.development.json', JSON.stringify(request.payload), 'utf8', (err) => {
//                 if (err) throw err;
//             });
//         } else {
//             if (process.env.NODE_ENV == 'production') {
//                 fs.writeFile('./config/config.production.json', JSON.stringify(request.payload), 'utf8', (err) => {
//                     if (err) throw err;
//                 });
//             }
//         }
        
//         return 'Config saved!';
//     }
// });

// the auth endpoint for a private channel pusher
// server.route({
//     method: 'POST',
//     path: '/pusher/auth', 
//     handler: function(req, h) {
//         var socketId = req.payload.socket_id;
//         var channel = req.payload.channel_name;
//         var auth = pusher.authenticate(socketId, channel);
//         h.send(auth);
//     }
// });


const init = async () => {
//auto loading routes directories
    await server.register(require('hapi-auto-route'));
    //await server.register(require('hapi-auth-basic'));
    await server.start();
	//await socket_server.start();
    //console.log(`Socket Server running at: ${socket_server.info.uri}`);
	console.log(`Server running at: ${server.info.uri}`);
    //TODO add username and password
    //mongoose.set('debug', true);
    mongoose.connect(MongoDBUrl, {}).then(() => { console.log(`Connected to Mongo server`) }, err => { console.log(err) });

};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
