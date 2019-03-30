"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// Our Express APP config
const app = express();
app.set("port", process.env.PORT || 3000);
// API Endpoints
app.get("/", (req, res) => {
    res.send("Hi");
});
exports.default = app;
