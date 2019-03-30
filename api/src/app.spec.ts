import { app, helpful404 } from './app';
import request from 'supertest';

describe('The app', () => {
	it('returns 404 for non-existent routes part 1', async () => {
		const result = await request(app).get('/');
		expect(result.body).toEqual(helpful404);
		expect(result.status).toEqual(404);
	});

	it('returns 404 for non-existent routes part 2', async () => {
		const result = await request(app).get('/api');
		expect(result.body).toEqual(helpful404);
		expect(result.status).toEqual(404);
	});

	it('does not cause 404 error for favicon', async () => {
		const result = await request(app).get('/favicon.ico');
		expect(result.status).toEqual(204);
	});
});