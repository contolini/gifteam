function tick(){
  postMessage('tick');
}

var onmessage = function(e){
  switch (e.data) {
    case 'start':
      return tick();
    case 'tick':
      return setTimeout(tick, 3000);
  //  case 'stop':
  //    return self.clearInterval(interval);
  }
};
