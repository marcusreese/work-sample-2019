"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = app_1.default.get("port");
const env = app_1.default.get("env");
const server = app_1.default.listen(port, () => {
    console.log(`App is running on http://localhost:${port} in ${env} mode`);
});
exports.default = server;
