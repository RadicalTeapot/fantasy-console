const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const net = require('net');

const PORT = 8080;
const TCP_SERVER_PORT = 8081;
const root = path.join(__dirname, '..');
// this string is just part of the RFC protocol spec
const MAGIC_SOCKET_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
};

const server = http.createServer((req, res) => {
    const filePath = path.join(root, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const mime_type = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': mime_type });
            res.end(content);
        }
    });
});

const httpWsClients = [];
server.on('upgrade', (req, socket) => {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad Request');
        return;
    }

    const acceptKey = req.headers['sec-websocket-key'];
    const hash = crypto
        .createHash('sha1')
        .update(acceptKey + MAGIC_SOCKET_STRING)
        .digest('base64');

    // Send WebSocket handshake response
    socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${hash}\r\n` +
        '\r\n'
    );

    console.log('Client connected');
    httpWsClients.push(socket);

    socket.on('error', err => {
        console.log('Client error');
        console.error(err);
        httpWsClients.splice(httpWsClients.indexOf(socket), 1);
    });
    socket.on('end', () => {
        console.log('Client disconnected');
        httpWsClients.splice(httpWsClients.indexOf(socket), 1);
    });
});

const tcp_server = net.createServer(socket => {
    // console.log('TCP Client connected');
    // socket.on('end', () => console.log('TCP Client disconnected'));
    socket.on('data', data => {
        const message = data.toString('utf-8');
        console.log(`Received ${message} from TCP client`);
        if (message.trim() === 'reload') {
            const payload = Buffer.from('reload');
            const payloadLength = payload.length;
            httpWsClients.forEach((client, i) => {
                console.log(`Sending reload message to client ${i}`);
                client.write(Buffer.from([0x81, payloadLength, ...payload]));
            });
        }
    });
});
tcp_server.on('error', (err) => {
    console.error(err);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Websocket listening on ws://localhost:${PORT}`);
    tcp_server.listen(TCP_SERVER_PORT, () => console.log(`TCP server listening on ${TCP_SERVER_PORT}`));
});
