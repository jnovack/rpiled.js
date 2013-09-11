#!/usr/bin/node
/*
 * webserver.js - Color Picker Browser
 *
 * Front-end for RPi LED control.
 * - Serves webpages
 * - Accepts socket.io connections from webpages
 * - Connects to backend socket
 * - Issues commands to backend socket
 */


/*
 * Initialize Variables
 */
//var      fs = require('fs');
//var  Schema = require('protobuf').Schema;
//var  schema = new Schema(fs.readFileSync('protobuf/lifx.desc'));
//var Command = schema['lifx.Command'];
var express = require('express')
  , app = express();
app.use(express.static(__dirname + '/www'));
var http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , ioc = require('socket.io-client')
  , led = ioc.connect('http://localhost:8533', {reconnect: true});
var colors = {
    1: { index: 1, red: 0, green: 0, blue: 0, alpha: 0 },
    2: { index: 2, red: 0, green: 0, blue: 0, alpha: 0 },
    3: { index: 3, red: 0, green: 0, blue: 0, alpha: 0 },
    4: { index: 4, red: 0, green: 0, blue: 0, alpha: 0 }
  };
io.set('log level', 0);

/*
 * Socket (Back End)
 * Send commands to the RPi LED Server
 */
led.on('connect', function() {
    console.log("Connected.");
    led.on('error', function(e) {
      console.log("error..");
      led.close();
    });
    led.on('color', function (data) {
      console.log('Recv: ' + JSON.stringify({ index: 1, red: data.red, green: data.green, blue: data.blue, alpha: data.alpha}));
      colors[data.index] = data;
      io.sockets.emit('getcolor', colors[data.index]);
    })
    led.on('close', function() {
      console.log('closed..');
//      setTimeout( function() { connect(); }, 2000);
    });
  }).on('error', function(e) {
    // Connection error BEFORE connection established.
    console.log("retrying...");
  });
// TODO Reconnect function

/*
 * Set up the webbrowser front-end and websocket middleware.
 */
server.listen(8000);

/* Websocket (Front End)
 * Process the incoming color data and send to the webpages
 */
var count = 0;
io.sockets.on('connection', function (socket) {
  socket.emit('getcolor', colors[1]);
  socket.emit('getcolor', colors[2]);
  socket.emit('getcolor', colors[3]);
  socket.emit('getcolor', colors[4]);
  socket.on('setcolor', function (data) {
    count++;
    console.log("Message " + count + " = I:" + data.index + " R:" + data.red + ", G: " + data.green + ", B: " + data.blue + ", A:" + data.alpha);
    //var serial = Command.serialize(data);
    led.emit('set', data);
  });

  socket.on('disconnect', function () {
    // Placeholder
  });
});

