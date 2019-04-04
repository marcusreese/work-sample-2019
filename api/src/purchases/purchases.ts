import express from 'express';

export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.post('/', (req, res) => {
	const { stockSymbol, maxInvestment } = req.body;
	res.json(req.body);
});

purchasesRouter.get('/', (req, res) => {
	console.log('get received')
	res.json([]);
});

