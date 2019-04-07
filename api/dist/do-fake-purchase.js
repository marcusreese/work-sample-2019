"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
exports.doFakePurchase = (stockSymbol, maxInvestment) => {
    const url = `https://api.iextrading.com/1.0/stock/${stockSymbol}/price`;
    return got_1.default(url).then((resp) => {
        const { body, statusCode } = resp;
        const price = Number(body);
        const numSharesBought = Math.floor(maxInvestment / price);
        if (!numSharesBought) {
            return Promise.reject({
                status: 400,
                data: {
                    stockSymbol,
                    maxInvestment,
                    price,
                    numSharesBought,
                    time: Date.now()
                },
                message: `The price of a single share was higher than your maximum investment.\n` +
                    `Fractional shares are not allowed.`
            });
        }
        return Promise.resolve({
            status: 200,
            data: {
                stockSymbol,
                maxInvestment,
                price,
                numSharesBought,
                time: Date.now()
            }
        });
    }, (error) => {
        return Promise.reject({
            status: 500,
            data: {
                stockSymbol,
                maxInvestment,
                numSharesBought: 0,
                time: Date.now()
            },
            message: `The current price was unavailable. Please try again.`
        });
    });
};
