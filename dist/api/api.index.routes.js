"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_route_1 = __importDefault(require("./v1/routes/index.route"));
const imageUpload_1 = __importDefault(require("../api/v1/controller/testImage/imageUpload"));
const indexRoute = (0, express_1.Router)();
indexRoute.use("/v1", index_route_1.default);
indexRoute.use("/zaruiPapers", imageUpload_1.default);
exports.default = indexRoute;
