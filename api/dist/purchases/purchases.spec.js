"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const purchases_1 = require("./purchases");
describe('purchases resource', () => {
    it('returns something for post', async () => {
        const postBody = { hi: 'hey' };
        const result = await supertest_1.default(app_1.app).post(app_1.prefix + purchases_1.purchasesSegment).send(postBody);
        expect(result.body).toEqual(postBody);
        expect(result.status).toEqual(200);
    });
    it('returns an array for get', async () => {
        const result = await supertest_1.default(app_1.app).get(app_1.prefix + purchases_1.purchasesSegment);
        expect(result.text).toEqual('[]');
        expect(result.status).toEqual(200);
    });
});
