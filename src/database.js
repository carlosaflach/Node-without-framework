import fs from 'node:fs/promises';

const dataBasePath = new URL('../db.json', import.meta.url);

export class Database {
	#database = {};

	constructor() {
		fs.readFile(dataBasePath, 'utf-8')
			.then((data) => {
				this.#database = JSON.parse(data);
			})
			.catch(() => {
				this.#persist();
			});
	}

	#persist() {
		fs.writeFile(dataBasePath, JSON.stringify(this.#database));
	}

	insert(table, data) {
		if (Array.isArray(this.#database[table])) {
			this.#database[table].push(data);
		} else {
			this.#database[table] = [data];
		}

		this.#persist();
		return data;
	}

	select(table, search) {
		let data = this.#database[table] ?? [];

		if (search) {
			data = data.filter((row) => {
				return Object.entries(search).some(([key, value]) => {
					return row[key].includes(value);
				});
			});
			return data;
		} else {
			return data;
		}
	}

	delete(table, id) {
		const rowIndex = this.#database[table].findIndex((row) => row.id === id);

		if (rowIndex > -1) {
			this.#database[table].splice(rowIndex, 1);
			this.#persist();
		}
	}

	update(method, table, id, data) {
		const taskExists = this.#database[table].find((task) => task.id === id);
		if (!taskExists) {
			return taskExists;
		}
		if (method === 'PUT') {
			const { target, info } = data;
			taskExists[target] = info;
			taskExists['updated_at'] = Date.now();
			const updatedTask = this.#database[table].find((task) => task.id === id);
			const rowIndex = this.#database[table].findIndex((row) => row.id === id);
			this.#database[table][rowIndex] = { ...updatedTask };
			this.#persist();

			return updatedTask;
		}
		if (method === 'PATCH') {
			if (taskExists['completed_at']) {
				taskExists['completed_at'] = null;
			} else {
				taskExists['completed_at'] = Date.now();
			}

			const taskWithCompleteStatus = this.#database[table].find(
				(task) => task.id === id
			);
			const rowIndex = this.#database[table].findIndex((row) => row.id === id);
			this.#database[table][rowIndex] = { ...taskWithCompleteStatus };
			this.#persist();
			return taskWithCompleteStatus;
		}
	}
}
