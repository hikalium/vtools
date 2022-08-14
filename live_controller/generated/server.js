import * as dotenv from 'dotenv';
import express from 'express';
import * as http from 'http';
import OBSWebSocket from 'obs-websocket-js';
import * as path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
dotenv.config();
if (process.env.OBS_HOST === undefined || process.env.OBS_PASS === undefined ||
    process.env.OBS_PORT === undefined) {
    console.error('OBS_HOST, OBS_PASS, OBS_PORT should be specified in .env');
    process.exit(1);
}
// https://www.npmjs.com/package/obs-websocket-js/v/4.0.3
// https://pub.dev/documentation/obs_websocket/latest/
const obs = new OBSWebSocket();
await obs
    .connect({
    address: `${process.env.OBS_HOST}:${process.env.OBS_PORT}`,
    password: process.env.OBS_PASS
})
    .then(() => {
    console.log(`Success! We're connected & authenticated.`);
    return obs.send('GetSceneList');
})
    .then(data => {
    console.log(`${data.scenes.length} Available Scenes!`);
    data.scenes.forEach(scene => {
        console.log(scene.name);
    });
    return obs.send('GetSourcesList');
})
    .then(data => {
    console.log(`${data.sources.length} Available sources!`);
    data.sources.forEach(source => {
        console.log(source.name);
    });
    return obs.send('GetSourceFilters', { sourceName: 'hikalium_vseeface' });
})
    .then(data => {
    console.log(`${data.filters.length} Available filters!`);
    data.filters.forEach(filter => {
        console.log(filter.name);
        console.log(filter.settings);
    });
    return obs.send('GetSourcesList');
})
    .catch(err => {
    console.log(err);
});
obs.on('SwitchScenes', data => {
    console.log(`New Active Scene: ${data['scene-name']}`);
    for (const s of data.sources) {
        console.log(`sources: ${s.name}`);
    }
});
obs.on('error', err => {
    console.error('socket error:', err);
});
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
    socket.on('change_hikalium_opacity', (v) => {
        console.log(`change_hikalium_opacity: ${v}`);
        obs.send('SetSourceFilterSettings', {
            sourceName: 'hikalium_vseeface',
            filterName: 'Color Correction',
            filterSettings: { opacity: v }
        });
    });
});
server.listen(3150, () => {
    console.log('listening on *:3150');
});
//# sourceMappingURL=server.js.map