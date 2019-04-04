"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = app_1.app.get('port');
const env = app_1.app.get('env');
const server = app_1.app.listen(port, () => {
    console.log(`App is running on http://localhost:${port} in ${env} mode`);
});
exports.default = server;
