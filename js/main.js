var gifshot = require('gifshot');
var firebase = require('firebase');
var yo = require('yo-yo');

firebase.initializeApp({
  apiKey: "AIzaSyD2Fj1_eWLFd0c3aiCUIHsSH0m63mUjufY",
  authDomain: "gifteam-afcb4.firebaseapp.com",
  databaseURL: "https://gifteam-afcb4.firebaseio.com",
  storageBucket: "",
});

firebase.auth().signInAnonymously().catch(function(error) {
  console.error(error);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    userID = user.uid;
  }
});

// I'm lazy.
var userID = null;
var userRef = null;

var users = [];
var container = listUsers(users);

function listUsers(users) {
  return yo`<ul>
    ${users.map(function (user) {
      return yo`<li><img src="${user}" /></li>`
    })}
  </ul>`
}

function saveGif() {
  if (!userID) return;
  userRef = firebase.database().ref('gifs/' + userID);
  userRef.onDisconnect().remove();
  gifshot.createGIF({}, function(obj) {
    if(!obj.error) {
      userRef.set({
        image: obj.image
      });
    }
  });
}

firebase.database().ref('gifs').on('value', function(data) {
  var data = data.val();
  users = [];
  for (var key in data) {
    users.push(data[key].image);
  }
  yo.update(container, listUsers(users));
});

setInterval(saveGif, 3000);

document.body.appendChild(container);
