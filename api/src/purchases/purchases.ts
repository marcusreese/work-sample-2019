import express, { response } from 'express';
import * as dfp from '../do-fake-purchase';
import { selectAll, insert, selectById } from './lowdb-purchase-storage';

export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.post('/', (req, res) => {
	const { stockSymbol, maxInvestment } = req.body;
	dfp.doFakePurchase(stockSymbol, maxInvestment).then((resp) => {
		return insert({
			symbol: resp.data.stockSymbol,
			price_4_dec: resp.data.price * (10 ** 4),
			num_shares: resp.data.numSharesBought,
			max_4_dec: maxInvestment * (10 ** 4),
			time: resp.data.time
		});
	}).then((inserted) => {
		res.json({
			data: inserted,
			status: 200
		});
	}).catch((err: any) => {
		console.log('err:', err);
		const status = err.status || 500;
		res.status(status).json({
			...err
		});
	});
});

purchasesRouter.get('/', (req, res) => {
	selectAll().then((retrieved) => {
		res.json(retrieved);
	}).catch((err: any) => {
		console.warn('selectAll error:', err);
		res.status(500).json(err);
	});
});

purchasesRouter.get('/:id', (req, res) => {
	selectById(req.params.id).then((retrieved) => {
		res.json(retrieved);
	}).catch((err: any) => {
		console.warn('selectById error:', err);
		res.status(500).json(err);
	});
});

