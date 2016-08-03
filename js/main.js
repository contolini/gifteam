var gifshot = require('gifshot');
var firebase = require('firebase');

// I'm lazy.
var userID = null;
var userRef = null;

var users = document.getElementById('users');

function saveGif() {
  gifshot.createGIF({}, function(obj) {
    if (!obj.error) {
      userRef.set({
        id: userID,
        image: obj.image
      });
    }
  });
}

function addUser(id, image) {
  return `<li id="${id}" class="user"><img src="${image}" alt="User ${id}" /></li>`;
}

function init(user) {
  userID = user.uid;
  userRef = firebase.database().ref('gifs/' + userID);
  userRef.onDisconnect().remove();
  setInterval(saveGif, 3000);
}

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
  if (user) init(user);
});

firebase.database().ref('gifs').on('value', function(data) {
  var data = data.val();
  var user;
  for (var key in data) {
    user = document.getElementById(key);
    if (!user) users.innerHTML += addUser(key, data[key].image);
  }
});

firebase.database().ref('gifs').on('child_changed', function(data) {
  var data = data.val();
  document.querySelector(`#${data.id} img`).src = data.image;
});
