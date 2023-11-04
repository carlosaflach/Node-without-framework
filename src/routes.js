import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';

const database = new Database();

export const routes = [
	{
		method: 'POST',
		path: buildRoutePath('/tasks'),
		handler: (req, res) => {
			const { title, description } = req.body;
			const task = {
				id: randomUUID(),
				title,
				description,
				created_at: Date.now(),
				completed_at: null,
				updated_at: null,
			};

			database.insert('tasks', task);

			return res.writeHead(201).end();
		},
	},
];
