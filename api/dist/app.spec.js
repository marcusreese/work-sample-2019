"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const supertest_1 = __importDefault(require("supertest"));
describe("GET / - a simple api endpoint", () => {
    it("Hello API Request", async () => {
        const result = await supertest_1.default(app_1.default).get("/");
        expect(result.text).toEqual("Hey");
        expect(result.status).toEqual(200);
    });
});
