"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const do_fake_purchase_1 = require("./do-fake-purchase");
const nock_1 = __importDefault(require("nock"));
describe('purchases resource', () => {
    it('rejects with 400 if not enough max investment', () => {
        nock_1.default('https://api.iextrading.com')
            .get(uri => uri.includes('stock'))
            .reply(200, '9.5');
        return do_fake_purchase_1.doFakePurchase('A', 9).then(resp => {
        }).catch((err => {
            const withoutTime = JSON.parse(JSON.stringify(err));
            delete withoutTime.data.time;
            expect(withoutTime).toEqual({
                "data": {
                    "maxInvestment": 9,
                    "numSharesBought": 0,
                    "price": 9.5,
                    "stockSymbol": "A"
                },
                "message": `The price of a single share was higher than your maximum investment.\n` +
                    `Fractional shares are not allowed.`,
                "status": 400,
            });
        }));
    });
    it('rejects with 500 if cannot get price', () => {
        nock_1.default('https://api.iextrading.com')
            .get(uri => uri.includes('stock'))
            .reply(503);
        return do_fake_purchase_1.doFakePurchase('A', 9).then(resp => {
        }).catch((err => {
            const withoutTime = JSON.parse(JSON.stringify(err));
            delete withoutTime.data.time;
            expect(withoutTime).toEqual({
                "data": {
                    "maxInvestment": 9,
                    "numSharesBought": 0,
                    "stockSymbol": "A",
                },
                "message": `The current price was unavailable. Please try again.`,
                "status": 500,
            });
        }));
    });
    it('resolves with 200 if enough max investment and price is returned', () => {
        nock_1.default('https://api.iextrading.com')
            .get(uri => uri.includes('stock'))
            .reply(200, '9.5');
        return do_fake_purchase_1.doFakePurchase('A', 10).then(resp => {
            const withoutTime = JSON.parse(JSON.stringify(resp));
            delete withoutTime.data.time;
            expect(withoutTime).toEqual({
                "data": {
                    "maxInvestment": 10,
                    "numSharesBought": 1,
                    "price": 9.5,
                    "stockSymbol": "A",
                },
                "status": 200,
            });
        });
    });
});
