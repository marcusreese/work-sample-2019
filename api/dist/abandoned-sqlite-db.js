"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = __importDefault(require("sqlite"));
const node_cleanup_1 = __importDefault(require("node-cleanup"));
let purchaseTable;
// server.ts does not start the express app unti purchaseTable is ready
exports.getPurchaseTable = () => purchaseTable;
exports.prepDb = () => {
    return sqlite_1.default.open('./stockPurchases.sqlite')
        .then((db) => {
        console.log('starting init db');
        return Promise.all([
            Promise.resolve(db),
            db.run(`CREATE TABLE IF NOT EXISTS purchase (
				id INT PRIMARY KEY,
				symbol TEXT,
				price_4_dec INT,
				num_shares INT,
				max_4_dec INT,
				time INT
			);`)
        ]);
    }).then((values) => {
        console.log('init db 2');
        const db = values[0];
        return Promise.all([
            Promise.resolve(db),
            db.run(`CREATE INDEX IF NOT EXISTS symbol_idx ON purchase(symbol)`)
        ]);
    }).then((values) => {
        console.log('init db 3');
        const db = values[0];
        return Promise.all([
            Promise.resolve(db),
            db.prepare("INSERT INTO purchase VALUES (?,?,?,?,?,?)")
        ]);
    }).then((values) => {
        const [db, insertRaw] = values;
        console.log('init db 4');
        const insert = (fields) => {
            const { symbol, price_4_dec, num_shares, max_4_dec, time } = fields;
            // const id = uuidv4();
            console.log('inserting:', null, symbol, price_4_dec, num_shares, max_4_dec, time);
            return insertRaw.run(null, symbol, price_4_dec, num_shares, max_4_dec, time);
            // return db.run(null, symbol, price_4_dec, num_shares, max_4_dec, time);
        };
        return Promise.all([
            Promise.resolve(db),
            Promise.resolve({ insert, insertRaw }),
            db.prepare("SELECT * FROM purchase WHERE id = ?")
        ]);
    }).then((values) => {
        const [db, dbStatements, selectById] = values;
        console.log('init db 5');
        return Promise.all([
            Promise.resolve(db),
            Promise.resolve({ selectById, ...dbStatements }),
            db.prepare("SELECT * FROM purchase WHERE symbol = ?")
        ]);
    }).then((values) => {
        const [db, dbStatements, selectBySymbol] = values;
        return Promise.all([
            Promise.resolve(db),
            Promise.resolve({ selectBySymbol, ...dbStatements }),
            db.prepare("SELECT * FROM purchase")
        ]);
    }).then((values) => {
        const [db, dbStatements, selectAll] = values;
        console.log('init db 7');
        purchaseTable = { selectAll, ...dbStatements };
        node_cleanup_1.default(function (exitCode, signal) {
            console.log('Cleaning Up!');
            Object.values(purchaseTable).forEach((obj) => {
                if (obj.run) {
                    obj.finalize();
                }
            });
            db.close();
            return true;
        });
        return Promise.resolve();
    });
};
