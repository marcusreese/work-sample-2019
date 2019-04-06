import request from 'supertest';
import { app, prefix } from '../app';
import { purchasesSegment } from './purchases';
import * as dfp from '../do-fake-purchase';
jest.mock('../do-fake-purchase');

describe('purchases resource', () => {
	it('handles 200 case', async () => {
		const testData = {
			status: 200,
			data: {
				numSharesBought: 4,
				price: 7,
				stockSymbol: 'ABC',
				maxInvestment: 123
			}
		};
		const spy = jest.spyOn(dfp, 'doFakePurchase');
		spy.mockImplementation((s, m) => Promise.resolve(testData));
		const result = await request(app).post(prefix + purchasesSegment).send({});
		expect(dfp.doFakePurchase).toHaveBeenCalledTimes(1);
		expect(result.body).toEqual(testData);
		expect(result.status).toEqual(200);
	});

	it('handles 500 case', async () => {
		const testData = {
			status: 500,
			data: {
				numSharesBought: 0,
				stockSymbol: 'ABC',
				maxInvestment: 123
			},
			message: 'Some message'
		};
		const spy = jest.spyOn(dfp, 'doFakePurchase');
		spy.mockImplementation((s, m) => Promise.reject(testData));
		const result = await request(app).post(prefix + purchasesSegment).send({});
		expect(dfp.doFakePurchase).toHaveBeenCalledTimes(2);
		expect(result.body).toEqual(testData);
		expect(result.status).toEqual(500);
	});

	it('returns an array for get', async () => {
		const result = await request(app).get(prefix + purchasesSegment);
		expect(result.text).toEqual('[]');
		expect(result.status).toEqual(200);
	});
});