"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user/user"));
const vcard_1 = __importDefault(require("./vcard/vcard"));
const card_1 = __importDefault(require("./card/card"));
const dashboard_1 = __importDefault(require("./dashboard/dashboard"));
const uploadFile_1 = __importDefault(require("../controller/uploadFile/uploadFile"));
const features_1 = __importDefault(require("./features/features"));
const profile_1 = __importDefault(require("./profile/profile"));
const invoice_1 = __importDefault(require("./invoice/invoice"));
const order_1 = __importDefault(require("./order/order"));
const wallet_1 = __importDefault(require("./wallet/wallet"));
const follow_1 = __importDefault(require("./follower/follow"));
const package_1 = __importDefault(require("./service/package"));
const website_1 = __importDefault(require("./website/website"));
// import staticDataRoute from "./static_data/staticData"
// import subscriptionRoute from "./subscription/subscription"
// import vkardzRoute from "./vkardz/vkardz"
// import affiliateRoute from "./affiliate/affiliate";
// import cardRoute from "./cart/card";
// // import aboutusRoute from "./aboutUs/aboutUs";
// import serviceRoute from "./services/service";
// import setUserPassword from "./userSetPassword/setPassword";
const notification_1 = __importDefault(require("./notification/notification"));
const indexRoute = (0, express_1.Router)();
indexRoute.use("/user", user_1.default);
indexRoute.use("/vcard", vcard_1.default);
indexRoute.use("/card", card_1.default);
indexRoute.use("/uploads", uploadFile_1.default);
indexRoute.use("/dashboard", dashboard_1.default);
indexRoute.use("/features", features_1.default);
indexRoute.use("/profile", profile_1.default);
indexRoute.use("/invoice", invoice_1.default);
indexRoute.use("/order", order_1.default);
indexRoute.use("/wallet", wallet_1.default);
indexRoute.use("/userFollow", follow_1.default);
indexRoute.use("/service", package_1.default);
indexRoute.use("/web", website_1.default);
// indexRoute.use("/staticData",staticDataRoute);
// indexRoute.use("/subscription",subscriptionRoute);
// indexRoute.use("/vkardz",vkardzRoute);
// indexRoute.use("/affiliate", affiliateRoute);
// // indexRoute.use("/aboutUs", aboutusRoute);
// indexRoute.use("/services", serviceRoute);
// indexRoute.use("/setPassword", setUserPassword);
indexRoute.use("/notification", notification_1.default);
exports.default = indexRoute;