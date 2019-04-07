import request from 'supertest';
import { app, prefix } from '../app';
import { purchasesSegment } from './purchases';
// import * as db from '../abandoned-sqlite-db';
// jest.mock('../db');
import * as dfp from '../do-fake-purchase';
jest.mock('../do-fake-purchase');


describe('purchases resource', () => {
	afterAll(async () => {
		await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
	});
	it('handles 200 case', async (done) => {
		// const dbSpy = jest.spyOn(db, 'getPurchaseTable');
		// dbSpy.mockImplementation(() => ({
		// 	insert: () => {},
		// 	selectById: {},
		// 	selectBySymbol: {},
		// 	selectAll: {}
		// }));
		const testData = {
			status: 200,
			data: {
				numSharesBought: 4,
				price: 7,
				stockSymbol: 'ABC',
				maxInvestment: 123,
				time: Date.now()
			}
		};
		const dfpSpy = jest.spyOn(dfp, 'doFakePurchase');
		dfpSpy.mockImplementation((s, m) => Promise.resolve(testData));
		const result = await request(app).post(prefix + purchasesSegment).send({});
		expect(dfp.doFakePurchase).toHaveBeenCalledTimes(1);
		expect(result.body).toEqual(testData);
		expect(result.status).toEqual(200);
		done();
	});

	it('handles 500 case', async () => {
		const testData = {
			status: 500,
			data: {
				numSharesBought: 0,
				stockSymbol: 'ABC',
				maxInvestment: 123,
				time: Date.now()
			},
			message: 'Some message'
		};
		const dfpSpy = jest.spyOn(dfp, 'doFakePurchase');
		dfpSpy.mockImplementation((s, m) => Promise.reject(testData));
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