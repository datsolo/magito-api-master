// var Notification = require("../models/notification");
// var Subscriber = require("../models/subscriber");
// var ObjectId = require("mongoose").Types.ObjectId;
// var Boom = require("boom");
// var Config = require('../config');

// var firebase = Config.firebase;
// var pusher = Config.pusher;

// exports.notify = (data, accounts) => {

//   if (Array.isArray(accounts)) {
//     var account_object_arr = [];
//     var notifications = [];
    
//     // for pusher
//     accounts.forEach(account => {
//       notifications.push({
//         account_id: new ObjectId(account),
//         title: data.firebase.title,
//         content: data.firebase.body
//       });

//       // convert string id to ObjectId and push to an array
//       account_object_arr.push(new ObjectId(account));
//       // push notification through pusher
//       var channel = `private-${account}`;
//       pusher.trigger(channel, data.pusher.event, data.pusher.content);
//     });

//     // save to database
//     Notification.create(notifications);

//     // for firebase
//     // find all device token by account id
//     return Subscriber.aggregate([
//       { $project: { account: 1, token: 1 } },
//       { $match: { account: { $in: account_object_arr } } },
//       { $sort: { created: -1 } },
//       { $group: { _id: "$account", token: { $first: "$token" } } }
//     ])
//       .then(subscribers => {
//         console.log(subscribers);
//         var token_arr = [];
//         subscribers.forEach(subscriber => {
//           token_arr.push(subscriber.token);
//         });
//         return firebase
//           .messaging()
//           .subscribeToTopic(token_arr, data.firebase.topic);
//       })
//       .then(response => {
//         console.log(response.errors[0].error);
//         var message = {
//           notification: {
//             title: data.firebase.title,
//             body: data.firebase.body
//           },
//           topic: data.firebase.topic
//         };
//         return message;
//       })
//       .then(message => {
//         return firebase.messaging().send(message);
//       })
//       .then(response => {
//         console.log(response);
//         return { message: "Notification sent successfully" };
//       })
//       .catch(err => {
//         return Boom.boomify(err, { statusCode: 422 });
//       });
//   } else {
//     // accounts is objectID of one user
//     Notification.create({
//       account_id: new ObjectId(accounts),
//       title: data.firebase.title,
//       content: data.firebase.body
//     });
//     // for pusher
//     var channel = `private-${accounts}`;
//     pusher.trigger(channel, data.pusher.event, data.pusher.content);
//     // for firebase
//     return Subscriber.findOne({ account: accounts })
//       .sort({ created: -1 })
//       .limit(1)
//       .exec()
//       .then(subscriber => {
//         console.log(subscriber);
//         var message = {
//           notification: {
//             title: data.firebase.title,
//             body: data.firebase.body
//           },
//           token: subscriber.token
//           // token: 'fydJgHubR7Q:APA91bFVFcznF7uifxd6hNrGZk4uiDHr1Dcea1-Ah2Rz1KRo7VLcSUZF0dau3L5LX53VLrfUK09z5u2V3ILvBoKCWRL_vMkpSlUAdv6oHaxSgm1gf2RMKkbUsLcYEqEf2_gqUoV3u4WtC6rfTnIE042bO6Iwc7cBUg'
//         };
//         return message;
//       })
//       .then(message => {
//         console.log(message);
//         return firebase.messaging().send(message);
//       })
//       .then(response => {
//         console.log(response);
//         return { message: "Notification sent successfully" };
//       })
//       .catch(err => {
//         return Boom.boomify(err, { statusCode: 422 });
//       });
//   }
// };
 
// // var method = Notify.prototype;
// // function Notify(type) {
// //   this.connect = pusher;
// // }

// // method.trigger = function(channel, event ,data, broadcast) {
// //   return this.connect.trigger(channel, event, data, broadcast);
// // }

// // var connection = new Notify('pusher');
// // module.exports = connection;
