import express from "express";
import { purchasesSegment, purchasesRouter } from "./purchases/purchases";

export const prefix = '/api/v1';

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(prefix + purchasesSegment, purchasesRouter)

app.get('/', (req, res) => {
  res.send("Hey");
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204)); // No Content

console.log('in app.ts');

export { app };