var gifshot = require('gifshot');
var firebase = require('firebase');
var work = require('webworkify');

// I'm lazy.
var userID = null;
var userRef = null;
var cameraStream = null;

// Work it.
var worker = work(require('./gif.js'));
worker.addEventListener('message', function(ev) {
  userRef.set({
    id: userID,
    image: ev.data
  });
}, false);

var users = document.getElementById('users');

function addUser(id, image) {
  return `<li id="user${id}" class="user"><img src="${image}" alt="User ${id}" /></li>`;
}

function init(user) {
  userID = user.uid;
  userRef = firebase.database().ref('gifs/' + userID);
  userRef.onDisconnect().remove();
}

firebase.initializeApp({
  apiKey: "AIzaSyD2Fj1_eWLFd0c3aiCUIHsSH0m63mUjufY",
  authDomain: "gifteam-afcb4.firebaseapp.com",
  databaseURL: "https://gifteam-afcb4.firebaseio.com",
  storageBucket: ""
});

firebase.auth().signInAnonymously().catch(function(error) {
  console.error(error);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user && !userID) init(user);
});

firebase.database().ref('gifs').on('child_added', function(data) {
  data = data.val();
  var user = document.getElementById(data.id);
  if (!user) users.innerHTML += addUser(data.id, data.image);
});

firebase.database().ref('gifs').on('child_changed', function(data) {
  data = data.val();
  document.querySelector(`#user${data.id} img`).src = data.image;
});

firebase.database().ref('gifs').on('child_removed', function(data) {
  data = data.val();
  var child = document.getElementById(`user${data.id}`);
  child.parentNode.removeChild(child);
});
