"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
console.log('in purchases.get.ts');
app_1.default.get("/api/v1/purchases", (req, res) => {
    res.json([]);
});
