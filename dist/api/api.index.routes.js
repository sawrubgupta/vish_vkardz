"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_route_1 = __importDefault(require("./corporateAdmin/controller/index.route"));
const index_route_2 = __importDefault(require("./v2/routes/index.route"));
const index_route_3 = __importDefault(require("./corporateAdminV2/controller/index.route"));
const indexRoute = (0, express_1.Router)();
// indexRoute.use("/v1", apiV1Router);
indexRoute.use("/v2", index_route_2.default);
indexRoute.use("/v1/admin", index_route_1.default);
indexRoute.use("/v2/admin", index_route_3.default);
exports.default = indexRoute;
