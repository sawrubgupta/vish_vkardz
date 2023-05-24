"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./admin/index"));
const index_2 = __importDefault(require("./profile/index"));
const index_3 = __importDefault(require("./teams/index"));
const corporateAdminRoute = (0, express_1.Router)();
corporateAdminRoute.use("/auth", index_1.default);
corporateAdminRoute.use("/profile", index_2.default);
corporateAdminRoute.use("/teams", index_3.default);
exports.default = corporateAdminRoute;
