import express from 'express';

export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.post('/', (req, res) => {
	console.log('post received:', req.body);
	res.json(req.body);
});

purchasesRouter.get('/', (req, res) => {
	res.json([]);
});

