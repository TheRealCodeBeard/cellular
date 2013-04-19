var Sampler = function(sampleRate,speed){
  var me = this;
  me.sampleRate = sampleRate;
  me.interval = speed*100;
  
  var Notes = {
    a:220,
    c:261.626,
    g:391.995,
    high_a:440
  };

  function getSamples(freq,rate,seconds){
    var ms = 44100*seconds;
    var samples = [];
    var k = 2 * Math.PI * freq / rate;
    var cycle = 0;
    for(var i = 0;i<ms;i++){
      samples.push(Math.sin(k * cycle++));
    }
    return samples;
  };

  function getNoise(seconds){
    var ms = 44100*seconds;
    var samples = [];
    for(var i = 0;i<ms;i++){
      samples.push(Math.random());
    }
    return samples;
  }

  me.a = getSamples(Notes.a,sampleRate,speed);
  me.c = getSamples(Notes.c,sampleRate,speed);
  me.g = getSamples(Notes.g,sampleRate,speed);
  me.high_a = getSamples(Notes.high_a,sampleRate,speed);
  me.noise = getNoise(speed);
}

var Channel = function(speed,sampleRate,things){
  var me = this;
  me.speed = speed;  
  me.loop = false;
  me.buffer = [];
  var audio = new Audio();
  audio.mozSetup(1, sampleRate);
  me.play = function(i){ if(me.buffer[i]) audio.mozWriteAudio(me.buffer[i]); };
  if(things) me.add(things);
};

Channel.prototype.add = function(things){
  for(var i = 0;i<things.length;i++){
    this.buffer.push(things[i]);
  }
  this.buffer.reverse();
};

Channel.prototype.start = function(){
    var me = this;
    var i = 0;
    var kill = false;
    if(me.buffer.length){
        me.play(i);
        i++;
        var interval = setInterval(function(){
          if(i>=me.buffer.length){
            if(!me.loop) {
              clearInterval(interval);
              kill = true;
            }
            i=0;
          }
          if(!kill) me.play(i);
          i++;
        },me.speed);
    }
};