var gifshot = require('gifshot');
var firebase = require('firebase');

// I'm lazy.
var userID = null;
var userRef = null;
var cameraStream = null;

var users = document.getElementById('users');

function saveGif() {
  gifshot.createGIF({
    keepCameraOn: true,
    cameraStream: cameraStream
  }, function(obj) {
    if (!obj.error) {
      userRef.set({
        id: userID,
        image: obj.image
      });
    }
    cameraStream = obj.cameraStream;
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

firebase.database().ref('gifs').on('child_added', function(data) {
  data = data.val();
  var user = document.getElementById(data.id);
  if (!user) users.innerHTML += addUser(data.id, data.image);
});

firebase.database().ref('gifs').on('child_changed', function(data) {
  data = data.val();
  document.querySelector(`#${data.id} img`).src = data.image;
});

firebase.database().ref('gifs').on('child_removed', function(data) {
  data = data.val();
  var child = document.getElementById(data.id);
  child.parentNode.removeChild(child);
});
