function tick(){
  console.log('ticking from worker', self.postMessage);
  self.postMessage(Date.now());
}

var onmessage = function(e){
  console.log('worker got message', e);
  switch (e.data) {
    case 'start':
      self.setInterval(tick, 3000);
      tick();
  //  case 'stop':
  //    return self.clearInterval(interval);
  }
};
