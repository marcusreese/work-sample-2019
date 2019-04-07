"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const v4_1 = __importDefault(require("uuid/v4"));
const adapter = new FileSync_1.default('db.json');
const db = lowdb_1.default(adapter);
const purchasesStr = 'purchases';
async function init() {
    db.defaults({ purchases: [] })
        .write();
}
exports.init = init;
;
exports.insert = async function (fields) {
    const entry = { id: v4_1.default(), ...fields };
    db.get(purchasesStr)
        .push(entry)
        .write();
    return entry;
};
exports.selectAll = async function (symbol) {
    if (symbol) {
        return db.get(purchasesStr)
            .filter({ symbol })
            .value();
    }
    else {
        return db.get(purchasesStr)
            .value();
    }
};
exports.selectById = async function (id) {
    return db.get(purchasesStr)
        .find({ id })
        .value();
};
