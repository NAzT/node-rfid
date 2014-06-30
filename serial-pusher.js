var _ = require('underscore')
var serialport = require("serialport")
var SerialPort = serialport.SerialPort
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '69516',
  key: '',
  secret: ''
});



var serialPort = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudrate: 9600,
  stopBits: 1,
  parity: 'none',
  dataBits: 8,
  flowControl: false,
  // parser: serialport.parsers.readline('\n')
});


var cardId = [] 
serialPort.on('data', function(data) {
  var b = data.readUInt8(0);

  cardId.push(data.toJSON())
  cardId = _.flatten(cardId)

  var ALLOW_CARDS = ['7550FD2D', 'B5D2422E'];
  var acl_passed = false;

  if (_.size(cardId) == 4) {
    var cardId_str= _.map(cardId, function(i) { return i.toString(16).toUpperCase() }).join('')
    
    acl_passed = _(ALLOW_CARDS).contains(cardId_str);
     
    if (acl_passed) {
      console.log("WELCOME", cardId_str, "!");
      pusher.trigger('my-channel', 'my_event', {
        "message": "hello world",
        "cardId": cardId_str,
        "power": 1
      });
    } 
    else {
      pusher.trigger('my-channel', 'my_event', {
        "message": "hello world",
        "cardId": cardId_str,
        "power": 0
      });
      console.log(cardId_str, "IS NOT ALLOWED");
    }
    cardId = []
  }
});

serialPort.on("open", function () {
  console.log('openned');
  // var b = new Buffer(0x02)
  serialPort.write([0x02], function(err, results) {
    console.log('writed', arguments)
  });
});
