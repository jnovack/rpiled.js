#!/usr/bin/node
/*
 * index.js - RPi LED Controller
 *
 * The server to control the LED Strip.  Accepts commands.
 */

/*
 * Initialize Variables
 */
//var     fs  = require('fs');
//var  Schema = require('protobuf').Schema;
//var  schema = new Schema(fs.readFileSync('protobuf/lifx.desc'));
//var Command = schema['lifx.Command'];
var net = require('net');
var http = require('http');
// Create server & socket
var server = http.createServer(function(req, res){

    // Send HTML headers and message
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Aw, snap! 404</h1>');
});
server.listen(8533);
var colors = {
      1: { index: 1, red: 0, green: 0, blue: 0, alpha: 0 },
      2: { index: 2, red: 0, green: 0, blue: 0, alpha: 0 },
      3: { index: 3, red: 0, green: 0, blue: 0, alpha: 0 },
      4: { index: 4, red: 0, green: 0, blue: 0, alpha: 0 }
    },
    count = 0;
var io = require('socket.io').listen(server);
io.set('log level', 0);
// Load LED Controlling libraries here!

/* 
 * Socket (Back end)
 * Process the commands from the socket connections
 */
io.sockets.on('connection', function(socket) {
  // Initialize Client with current variables
  socket.emit('color', { index: 1, red: colors[1].red, green: colors[1].green, blue: colors[1].blue, alpha: colors[1].alpha});
  console.log('emit: ' + JSON.stringify({ index: 1, red: colors[1].red, green: colors[1].green, blue: colors[1].blue, alpha: colors[1].alpha}));

  // Process data
  socket.on('set', function(data) {
    count++;
    //var command = Command.parse(data);
    var cmd = data;
    console.log("Message " + count +
      "  I: " + cmd.index +
      "  R: " + cmd.red +
      "  G: " + cmd.green +
      "  B: " + cmd.blue +
      "  A: " + cmd.alpha
    );
    colors[cmd.index].red   = cmd.red;
    colors[cmd.index].green = cmd.green;
    colors[cmd.index].blue  = cmd.blue;
    colors[cmd.index].alpha = cmd.alpha;
    console.log('Sent: ' + JSON.stringify({ index: 1, red: colors[1].red, green: colors[1].green, blue: colors[1].blue, alpha: colors[1].alpha}));
    io.sockets.emit('color', {
      index: cmd.index,
      red: cmd.red,
      green: cmd.green,
      blue: cmd.blue,
      alpha: cmd.alpha
    });
  });
  // Do something here
});
