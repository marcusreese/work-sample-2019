import got from 'got';

export const doFakePurchase = (stockSymbol: string, maxInvestment: number) => {
	const url = `https://api.iextrading.com/1.0/stock/${stockSymbol}/price`;
	return got(url).then((resp: got.Response<string>) => {
		const { body, statusCode } = resp;
		const price = Number(body);
		const numSharesBought = Math.floor(maxInvestment/price);
		if (!numSharesBought) {
			return Promise.reject({
				status: 400,
				data: {
					stockSymbol,
					maxInvestment,
					price,
					numSharesBought
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
			}
		});
	}, (error: any) => {
		return Promise.reject({
			status: 500,
			data: {
				stockSymbol,
				maxInvestment,
				numSharesBought: 0
			},
			message: `The current price was unavailable. Please try again.`
		});
	});
}
