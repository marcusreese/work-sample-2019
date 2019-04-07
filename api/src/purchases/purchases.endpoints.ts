import express from 'express';
import * as dfp from '../do-fake-purchase';
import { selectMultiple, insert, selectById } from './purchases.storage';
import { validatePost, translateToDbFormat, translateFromDbFormat, DbPurchase } from './purchases.format';

export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.post('/', (req, res) => {
	validatePost(req)
	.then(({stockSymbol, maxInvestment}) => dfp.doFakePurchase(stockSymbol, maxInvestment))
	.then((purchaseInfo) => translateToDbFormat(purchaseInfo))
	.then((insertable) => insert(insertable))
	.then((inserted) => translateFromDbFormat(inserted))
	.then((readable) => res.json({ data: readable, status: 200 }))
	.catch((err: any) => {
		console.log('err:', err);
		const status = err.status || 500;
		res.status(status).json(err);
	});
});

purchasesRouter.get('/', (req, res) => {
	selectMultiple(req.query.symbol)
	.then((retrieved) => Promise.all(retrieved.map(
		(item: any) => translateFromDbFormat(item))))
	.then((readable: any[]) => res.json(readable))
	.catch((err: any) => {
		console.warn('selectMultiple error:', err);
		const status = err.status || 500;
		res.status(status).json(err);
	});
});

purchasesRouter.get('/:id', (req, res) => {
	selectById(req.params.id)
	.then((retrieved) => translateFromDbFormat(retrieved as DbPurchase))
	.then((readable) => res.json(readable))
	.catch((err: any) => {
		console.warn('selectById error:', err);
		const status = err.status || 500;
		res.status(status).json(err);
	});
});
