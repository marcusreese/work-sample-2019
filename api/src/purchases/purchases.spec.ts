import request from 'supertest';
import { app, prefix } from '../app';
import { purchasesSegment } from './purchases';
import * as dfp from '../do-fake-purchase';
jest.mock('../do-fake-purchase');
import * as lowdb from './lowdb-purchase-storage';
jest.mock('./lowdb-purchase-storage');


describe('purchases resource', () => {
	afterAll(async () => {
		await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
	});
	it('handles 200 post', async (done) => {
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

	it('handles 500 post', async () => {
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

	it('returns an array for getAll', async () => {
		const lowdbSpy = jest.spyOn(lowdb, 'selectAll');
		lowdbSpy.mockResolvedValue(([]));
		const result = await request(app).get(prefix + purchasesSegment);
		expect(result.text).toEqual('[]');
		expect(result.status).toEqual(200);
	});
});