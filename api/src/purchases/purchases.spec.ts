import request from 'supertest';
import { app, prefix } from '../app';
import { purchasesSegment } from './purchases';

describe('purchases resource', () => {
	it('returns something for post', async () => {
		const postBody = { hi: 'hey' };
		const result = await request(app).post(prefix + purchasesSegment).send(postBody);
		expect(result.body).toEqual(postBody);
		expect(result.status).toEqual(200);
	});

	it('returns an array for get', async () => {
		const result = await request(app).get(prefix + purchasesSegment);
		expect(result.text).toEqual('[]');
		expect(result.status).toEqual(200);
	});
});