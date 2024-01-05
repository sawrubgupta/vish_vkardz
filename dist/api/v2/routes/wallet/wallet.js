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
const referController = __importStar(require("../../controller/wallet/refer"));
const coinsController = __importStar(require("../../controller/wallet/wallet"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const walletRouter = (0, express_1.Router)();
walletRouter.get("/checkReferralCode", referController.checkReferCode);
walletRouter.post("/applyReferCode", authorization_controller_1.authenticatingToken, referController.useReferCode);
walletRouter.get("/referCoinList", authorization_controller_1.authenticatingToken, referController.referCoinHistory);
walletRouter.get("/walletHistory", authorization_controller_1.authenticatingToken, coinsController.coinHistory);
walletRouter.post("/reedemCouponCoin", authorization_controller_1.authenticatingToken, coinsController.reedemCouponCoin);
exports.default = walletRouter;
