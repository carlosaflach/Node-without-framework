import http from 'node:http';
import { json } from './middlewares/json.js';
const PORT = 3333;

const server = http.createServer(async (req, res) => {
	const { method, url } = req;

	await json(req, res);

	res.writeHead(200).end('Hello from the server');
});

server.listen(PORT);
