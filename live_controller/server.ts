import express from 'express';
import * as http from 'http';
import * as path from 'path';
import {Server} from 'socket.io';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootPath = path.dirname(path.dirname(__filename));
console.log(typeof express);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
  res.sendFile(rootPath + '/index.html');
});
app.get('/nanokontrol2.js', (_req, res) => {
  res.sendFile(rootPath + '/nanokontrol2.js');
});
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('new_todo', (s) => {
  });
});
server.listen(3150, () => {
  console.log('listening on *:3150');
});
