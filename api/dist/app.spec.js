"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const supertest_1 = __importDefault(require("supertest"));
describe('The app', () => {
    it('returns 404 for non-existent routes part 1', async () => {
        const result = await supertest_1.default(app_1.app).get('/');
        expect(result.body).toEqual(app_1.helpful404);
        expect(result.status).toEqual(404);
    });
    it('returns 404 for non-existent routes part 2', async () => {
        const result = await supertest_1.default(app_1.app).get('/api');
        expect(result.body).toEqual(app_1.helpful404);
        expect(result.status).toEqual(404);
    });
    it('does not cause 404 error for favicon', async () => {
        const result = await supertest_1.default(app_1.app).get('/favicon.ico');
        expect(result.status).toEqual(204);
    });
});
