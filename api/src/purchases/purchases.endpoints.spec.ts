import request from 'supertest';
import { app, prefix } from '../app';
import { purchasesSegment } from './purchases.endpoints';
import * as dfp from '../do-fake-purchase';
jest.mock('../do-fake-purchase');
import * as lowdb from './purchases.storage';
jest.mock('./purchases.storage');
import * as format from './purchases.format';
jest.mock('./purchases.format');

describe('purchases resource', () => {
	afterAll(async () => {
		await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
	});
	it('handles 200 post', async (done) => {
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
		const formatSpy = jest.spyOn(format, 'validatePost');
		formatSpy.mockResolvedValue(testData);
		const dfpSpy = jest.spyOn(dfp, 'doFakePurchase');
		dfpSpy.mockImplementation((s, m) => Promise.resolve(testData));
		const formatSpy2 = jest.spyOn(format, 'translateFromDbFormat');
		formatSpy2.mockResolvedValue(testData.data as any);
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
		const formatSpy = jest.spyOn(format, 'validatePost');
		formatSpy.mockResolvedValue(testData);
		const dfpSpy = jest.spyOn(dfp, 'doFakePurchase');
		dfpSpy.mockImplementation((s, m) => Promise.reject(testData));
		const result = await request(app).post(prefix + purchasesSegment).send({});
		expect(dfp.doFakePurchase).toHaveBeenCalledTimes(2);
		expect(result.body).toEqual(testData);
		expect(result.status).toEqual(500);
	});

	it('returns an array for selectMultiple', async () => {
		const lowdbSpy = jest.spyOn(lowdb, 'selectMultiple');
		lowdbSpy.mockResolvedValue([]);
		const formatSpy = jest.spyOn(format, 'validatePost');
		formatSpy.mockResolvedValue([]);
		const result = await request(app).get(prefix + purchasesSegment);
		expect(result.text).toEqual('[]');
		expect(Array.isArray(JSON.parse(result.text))).toBe(true);
		expect(result.status).toEqual(200);
	});

	it('returns an object for selectById', async () => {
		const lowdbSpy = jest.spyOn(lowdb, 'selectById');
		lowdbSpy.mockResolvedValue({} as any);
		const formatSpy = jest.spyOn(format, 'validatePost');
		formatSpy.mockResolvedValue({});
		const result = await request(app).get(prefix + purchasesSegment + '/myId');
		expect(Array.isArray(JSON.parse(result.text))).toBe(false);
		expect(result.status).toEqual(200);
	});
});