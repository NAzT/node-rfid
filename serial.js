var _ = require('underscore')
var serialport = require("serialport")
var SerialPort = serialport.SerialPort
var serialPort = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudrate: 9600,
  stopBits: 1,
  parity: 'none',
  dataBits: 8,
  flowControl: false,
  // parser: serialport.parsers.readline('\n')
});


var ALLOW_CARDS = ['7550FD2D', 'B5D2422E'];
var acl_passed = false;

var cardId = [] 
serialPort.on('data', function(data) {
  var b = data.readUInt8(0);

  console.log('data received: ', data);

  cardId.push(data.toJSON())
  cardId = _.flatten(cardId)

  if (_.size(cardId) == 4) {
    console.log(cardId)
    var cardId_str= _.map(cardId, function(i) { return i.toString(16).toUpperCase() }).join('')
    console.log(cardId_str)
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
