"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
exports.purchasesSegment = '/purchases';
exports.purchasesRouter = express_1.default.Router();
exports.purchasesRouter.post('/', (req, res) => {
    console.log('post received:', req.body);
    res.json(req.body);
});
exports.purchasesRouter.get('/', (req, res) => {
    res.json([]);
});
