import http from 'node:http';
const PORT = 3333;

const server = http.createServer((req, res) => {
	res.writeHead(200).end('Hello from the server');
});

server.listen(PORT);
