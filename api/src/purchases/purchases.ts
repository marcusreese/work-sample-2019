import express, { response } from 'express';
import { doFakePurchase } from '../do-fake-purchase';

export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.post('/', (req, res) => {
	const { stockSymbol, maxInvestment } = req.body;
	doFakePurchase(stockSymbol, maxInvestment).then((resp: any)=> {
		// TODO save purchase here
		res.json({
			data: resp.data,
			status: 200
		});
	}).catch((err: any) => {
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

