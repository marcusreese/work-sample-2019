"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const purchases_storage_1 = require("./purchases/purchases.storage");
const port = app_1.app.get('port');
const env = app_1.app.get('env');
purchases_storage_1.init().then(() => {
    app_1.app.listen(port, () => {
        console.log(`App is running on http://localhost:${port} in ${env} mode`);
    });
});
