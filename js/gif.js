var gifshot = require('gifshot');
var cameraStream;

function saveGif() {
  gifshot.createGIF({
    keepCameraOn: true,
    cameraStream: cameraStream
  }, function(obj) {
    if (!obj.error) {
      self.postMessage([obj.image]);
    }
    cameraStream = obj.cameraStream;
  });
}

module.exports = function (self) {
  saveGif();
  setInterval(saveGif, 3000);
};
