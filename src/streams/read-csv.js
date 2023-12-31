import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('../../tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const parser = parse({
	fromLine: 2,
	delimiter: ',',
	skipEmptyLines: true,
});

const readCsv = async () => {
	const linesRead = stream.pipe(parser);

	for await (const line of linesRead) {
		const [title, description] = line;

		await fetch('http://localhost:3333/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				description,
			}),
		});
	}
};

readCsv();
