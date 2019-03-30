import express from 'express';

export const purchasesSegment = '/purchases';
export const purchasesRouter = express.Router();

purchasesRouter.get('/', (req, res) => {
	res.json([]);
});

