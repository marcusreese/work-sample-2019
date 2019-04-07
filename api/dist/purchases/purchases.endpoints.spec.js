"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const purchases_endpoints_1 = require("./purchases.endpoints");
const dfp = __importStar(require("../do-fake-purchase"));
jest.mock('../do-fake-purchase');
const lowdb = __importStar(require("./purchases.storage"));
jest.mock('./purchases.storage');
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
        const dfpSpy = jest.spyOn(dfp, 'doFakePurchase');
        dfpSpy.mockImplementation((s, m) => Promise.resolve(testData));
        const result = await supertest_1.default(app_1.app).post(app_1.prefix + purchases_endpoints_1.purchasesSegment).send({});
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
        const result = await supertest_1.default(app_1.app).post(app_1.prefix + purchases_endpoints_1.purchasesSegment).send({});
        expect(dfp.doFakePurchase).toHaveBeenCalledTimes(2);
        expect(result.body).toEqual(testData);
        expect(result.status).toEqual(500);
    });
    it('returns an array for getAll', async () => {
        const lowdbSpy = jest.spyOn(lowdb, 'selectAll');
        lowdbSpy.mockResolvedValue(([]));
        const result = await supertest_1.default(app_1.app).get(app_1.prefix + purchases_endpoints_1.purchasesSegment);
        expect(result.text).toEqual('[]');
        expect(result.status).toEqual(200);
    });
});
