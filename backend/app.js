const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
// const format = require('./public/messages');
const { join, current, users, leave } = require('./users');
const cors = require('cors');
const process = require('process');

const memoryUsage = () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}
setInterval(() => {
    memoryUsage()
}, 2000)

app.use(express.static('public'));
app.use(cors());

// starting server
io.on('connection', (socket) => {
    // number of users
    let nou = 0;
    let id;
    // on user connection
    socket.on('join', (roomId) => {
        id = join(socket.id);
        socket.join(roomId);
        socket.to(roomId).emit('server', 'Connection established');
    });
    // user connects
    nou++;
    console.log(`Number of users ${nou}`);

    // user disconnected
    socket.on('disconnect', () => {
        leave(socket.id);
        console.log(users);
        nou--;
        socket.to(id).emit('server', 'Connection dropped');
        console.log(`Number of users ${nou}`);
    });

    // listen for msg
    socket.on('msg', (roomId, msg) => {
        memoryUsage()
        const idm = current(socket.id);
        console.log("RoomId: " + roomId);
        console.log("Message: " + msg);

        socket.broadcast.to(roomId).emit('message', {id: socket.id, message: msg});
    });
});

server.listen(8000, () => {
    console.log('Listening on port 8000');
});
