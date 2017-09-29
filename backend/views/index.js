var express = require('express'),
app = express(),
http = require('http').Server(app),
WebSocketServer = require('ws').Server,
wss = new WebSocketServer({
    port: 8080
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

wss.broadcast = function broadcast(data) {
wss.clients.forEach(function each(client) {
    client.send(data);
});
};

wss.on('connection', function(ws) {
ws.on('message', function(msg) {
    data = JSON.parse(msg);
    if (data.message) wss.broadcast('<strong>' + data.name + '</strong>: ' + data.message);
});
});

http.listen(3000, function() {
console.log('listening on *:3000');
});
