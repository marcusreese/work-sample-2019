import express from 'express';
import bodyParser from 'body-parser';
import { purchasesSegment, purchasesRouter } from './purchases/purchases';

export const app = express();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

export const prefix = '/api/v1';
app.use(prefix + purchasesSegment, purchasesRouter);

app.get('/favicon.ico', (req, res) => res.sendStatus(204)); // No Content

export const helpful404 = { errorMessage: '404 Not Found -- try /api/v1/purchases' };
app.use(function (req, res, next) {
	res.status(404).json(helpful404);
});
