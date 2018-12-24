

var firebase = require("firebase-admin");
var serviceAccount = require("./magito-71481-firebase-adminsdk-dax5g-0f381d4346.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://magito-71481.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("/users/eokN90HsQWjzZWpeSzPU");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
