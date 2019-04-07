import { Request } from 'express';
export const validatePost = async function (req: Request) {
	const { stockSymbol, maxInvestment } = req.body as any;
	const messageStart = `The purchase could not succeed because`;
	const messageArray = [];
	if (!stockSymbol) {
		messageArray.push(`- there was no stockSymbol`);
	} else if (!stockSymbol.match(/\w/)) {
		messageArray.push(`- stockSymbol had no alphabetical characters`);
	}
	if (!maxInvestment) {
		messageArray.push(`- there was no maxInvestment`);
	} else if (isNaN(maxInvestment)) {
		messageArray.push(`- maxInvestment was not a number`);
	}
	if (messageArray.length) {
		Promise.reject({
			status: 400,
			message: [messageStart, ...messageArray].join('\n')
		});
	} else {
		return Promise.resolve(req.body);
	}
}

export const translateToDbFormat = async function (purchase: any) {
	return {
		symbol: purchase.data.stockSymbol,
		price_4_dec: purchase.data.price * (10 ** 4),
		num_shares: purchase.data.numSharesBought,
		max_4_dec: purchase.data.maxInvestment * (10 ** 4),
		time: purchase.data.time
	};
}

export interface DbPurchase {
	symbol?: string;
	price_4_dec?: number;
	num_shares?: number;
	max_4_dec?: number;
	time?: number;
	id?: string;
}
export const translateFromDbFormat = async function (dbPurchase?: DbPurchase) {
	const purchaseEntry = dbPurchase || {};
	const { time, symbol, max_4_dec, price_4_dec, num_shares, id } = purchaseEntry;
	const when = new Date(time || Date.now()).toString().split(' (')[0];
	const stockSymbol = symbol || 'Unknown';
	const maxInv = max_4_dec ?
		'$' + (max_4_dec / (10 ** 4)).toFixed(2)
		: 'Unknown';
	const priceWithDecimalPoint = (price_4_dec || 0) / (10 ** 4);
	const price = price_4_dec ?
		'$' + priceWithDecimalPoint.toFixed(4)
		: 'Unknown';
	const numShares = num_shares || 0;
	const total = '$' + (priceWithDecimalPoint * numShares).toFixed(2);
	const purchaseId = id || 'None';
	return {
		'Date and time': when,
		'Stock ticker symbol': stockSymbol,
		'Maximum investment': maxInv,
		'Price per share': price,
		'Number of shares purchased': numShares,
		'Total investment': total,
		'Purchase ID': purchaseId
	};
}
