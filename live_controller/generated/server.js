import express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
var __filename = fileURLToPath(import.meta.url);
var rootPath = path.dirname(path.dirname(__filename));
console.log(typeof express);
var app = express();
var server = http.createServer(app);
var io = new Server(server);
app.get('/', function (_req, res) {
    res.sendFile(rootPath + '/index.html');
});
app.get('/nanokontrol2.js', function (_req, res) {
    res.sendFile(rootPath + '/nanokontrol2.js');
});
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('new_todo', function (s) {
    });
});
server.listen(3150, function () {
    console.log('listening on *:3150');
});
//# sourceMappingURL=server.js.map