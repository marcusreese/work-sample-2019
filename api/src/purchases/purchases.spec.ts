import request from 'supertest';
import { app, prefix } from '../app';
import { purchasesSegment } from './purchases';

describe('GET / - a simple api endpoint', () => {
	it('Hello API Request', async () => {
		const result = await request(app).get(prefix + purchasesSegment);
		expect(result.text).toEqual('[]');
		expect(result.status).toEqual(200);
	});
});