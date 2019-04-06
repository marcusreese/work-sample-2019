import { doFakePurchase } from './do-fake-purchase';
import nock from 'nock';

describe('purchases resource', () => {
	it('rejects with 400 if not enough max investment', () => {
		nock('https://api.iextrading.com')
			.get(uri => uri.includes('stock'))
			.reply(200, '9.5');
		return doFakePurchase('A', 9).then(resp => {
		}).catch((err => {
			expect(err).toEqual({
				"data": {
					"maxInvestment": 9,
					"numSharesBought": 0,
					"price": 9.5,
					"stockSymbol": "A",
				},
				"message": `The price of a single share was higher than your maximum investment.\n` + 
				`Fractional shares are not allowed.`,
				"status": 400,
			});
		}));
	});

	it('rejects with 500 if cannot get price', () => {
		nock('https://api.iextrading.com')
			.get(uri => uri.includes('stock'))
			.reply(503);
		return doFakePurchase('A', 9).then(resp => {
		}).catch((err => {
			expect(err).toEqual({
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
		nock('https://api.iextrading.com')
			.get(uri => uri.includes('stock'))
			.reply(200, '9.5');
		return doFakePurchase('A', 10).then(resp => {
			expect(resp).toEqual({
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
