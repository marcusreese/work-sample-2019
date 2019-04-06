import express, { response } from 'express';
import * as dfp from '../do-fake-purchase';
import { getPurchaseTable } from '../db';


export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.post('/', (req, res) => {
	const purchaseTable = getPurchaseTable();
	const { stockSymbol, maxInvestment } = req.body;
	dfp.doFakePurchase(stockSymbol, maxInvestment).then((resp)=> {
		return Promise.all([
			Promise.resolve(resp),
			purchaseTable.insert({
				symbol: resp.data.stockSymbol,
				price_4_dec: resp.data.price * (10 ** 4),
				num_shares: resp.data.numSharesBought,
				max_4_dec: maxInvestment * (10 ** 4),
				time: resp.data.time
			})
		]);
	}).then((values) => {
		const resp = values[0];
		// const id = values[1];
		console.log('got past db, need id!:', values[1]);
		res.json({
			data: resp.data,
			status: 200
		});
	}).catch((err: any) => {
		console.log('err.status:', err.status);
		const status = err.status;
		res.status(status).json({
			...err
		});
	})
});

purchasesRouter.get('/', (req, res) => {
	console.log('get received')
	res.json([]);
});

