import { randomUUID } from 'node:crypto';
import { Database } from '../database.js';
import { buildRoutePath } from '../utils/build-path-route.js';

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

			return res.writeHead(201).end(JSON.stringify(task));
		},
	},
];
