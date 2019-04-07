"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dfp = __importStar(require("../do-fake-purchase"));
const purchases_storage_1 = require("./purchases.storage");
const purchases_format_1 = require("./purchases.format");
exports.purchasesSegment = '/purchases';
exports.purchasesRouter = express_1.default.Router();
exports.purchasesRouter.post('/', (req, res) => {
    purchases_format_1.validatePost(req).then(body => {
        const { stockSymbol, maxInvestment } = body;
        return dfp.doFakePurchase(stockSymbol, maxInvestment);
    }).then((purchaseInfo) => {
        return purchases_format_1.translateToDbFormat(purchaseInfo);
    }).then((insertable) => {
        return purchases_storage_1.insert(insertable);
    }).then((inserted) => {
        return purchases_format_1.translateFromDbFormat(inserted);
    }).then((readable) => {
        res.json({
            data: readable,
            status: 200
        });
    }).catch((err) => {
        console.log('err:', err);
        const status = err.status || 500;
        res.status(status).json({
            ...err
        });
    });
});
exports.purchasesRouter.get('/', (req, res) => {
    purchases_storage_1.selectAll(req.query.symbol).then((retrieved) => {
        res.json(retrieved);
    }).catch((err) => {
        console.warn('selectAll error:', err);
        res.status(500).json(err);
    });
});
exports.purchasesRouter.get('/:id', (req, res) => {
    purchases_storage_1.selectById(req.params.id).then((retrieved) => {
        res.json(retrieved);
    }).catch((err) => {
        console.warn('selectById error:', err);
        res.status(500).json(err);
    });
});
