"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./admin/index"));
const profile_1 = __importDefault(require("./profile"));
const corporateAdminRoute = (0, express_1.Router)();
corporateAdminRoute.use("/auth", index_1.default);
corporateAdminRoute.use("/profile", profile_1.default);
exports.default = corporateAdminRoute;
