"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.set("port", process.env.PORT || 3000);
// API Endpoints
app.get("/", (req, res) => {
    res.send("Hey");
});
console.log('in app.ts');
exports.default = app;
