const net = require('net');

const host = 'localhost';
const port = 8081;

const client = net.createConnection({port: port, host: host}, () => {
    console.log('Connected to WebSocket server');
    client.write('reload');
    console.log('Reload message sent');
    client.end(); // Close the connection after sending the message
});

client.on('error', (err) => {
    console.error('Failed to connect to the WebSocket server:', err.message);
});
client.on('end', () => {
  console.log('Disconnected from server');
});
