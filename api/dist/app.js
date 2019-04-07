"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const purchases_endpoints_1 = require("./purchases/purchases.endpoints");
exports.app = express_1.default();
exports.app.use(body_parser_1.default.json());
exports.app.set('port', process.env.PORT || 3000);
// CORS
exports.app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
exports.prefix = '/api/v1';
exports.app.use(exports.prefix + purchases_endpoints_1.purchasesSegment, purchases_endpoints_1.purchasesRouter);
exports.app.get('/favicon.ico', (req, res) => res.sendStatus(204)); // No Content
exports.helpful404 = { errorMessage: '404 Not Found -- try /api/v1/purchases' };
exports.app.use(function (req, res, next) {
    res.status(404).json(exports.helpful404);
});
