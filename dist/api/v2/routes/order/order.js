"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController = __importStar(require("../../controller/orders/transaction"));
const orderController = __importStar(require("../../controller/orders/order"));
const webhookController = __importStar(require("../../controller/orders/webhook"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const orderRouter = (0, express_1.Router)();
orderRouter.get("/getTransactions", authorization_controller_1.authenticatingToken, transactionController.transactionHistory);
orderRouter.get("/orderList", authorization_controller_1.authenticatingToken, orderController.orderHistory);
orderRouter.post("/cancelOrder", authorization_controller_1.authenticatingToken, orderController.cancelOrder);
orderRouter.get("/orderSummary", authorization_controller_1.authenticatingToken, orderController.orderSummary);
orderRouter.post("/webhooks", authorization_controller_1.authenticatingToken, webhookController.webhookApi);
exports.default = orderRouter;
