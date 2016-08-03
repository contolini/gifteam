var gifshot = require('gifshot');
var firebase = require('firebase');

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
    console.log(userID);
  }
});

// I'm lazy.
var userID = null;
var userRef = null;

var container = document.getElementById('users');
var userContainer = document.createElement('div');
var animatedImage = document.createElement('img')
userContainer.setAttribute('id', userID);
container.appendChild(userContainer);

var saveGif = function() {
  if (!userID) return;
  userRef = firebase.database().ref('gifs/' + userID);
  userRef.onDisconnect().remove();
  gifshot.createGIF({}, function(obj) {
    if(!obj.error) {
      var image = obj.image;
      userRef.set({
        image: image
      });
      animatedImage.src = image;
    }
  });
  return animatedImage.src;
}

setInterval(saveGif, 3000);

firebase.database().ref('gifs').on('child_changed', function(data) {
  var userEl = document.getElementById(userID);
  var userImg = document.createElement('img');
  userImg.src = data.val().image;

  // if the element doesn't exist, create it
  if (!userID && typeof(userEl) === 'undefined' || userEl === null) {
    userEl = document.createElement('div');
    userEl.setAttribute('id', userID);
    container.appendChild(userEl);
  } else {
    userEl.innerHTML = '';
  }

  userEl.appendChild(userImg);
});
