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
// import  profileRoute from "./profile/profile";
// import staticDataRoute from "./static_data/staticData"
// import subscriptionRoute from "./subscription/subscription"
// import orderRoute from "./order/order"
// import vkardzRoute from "./vkardz/vkardz"
// import affiliateRoute from "./affiliate/affiliate";
// import cardRoute from "./cart/card";
// // import aboutusRoute from "./aboutUs/aboutUs";
// import serviceRoute from "./services/service";
// import setUserPassword from "./userSetPassword/setPassword";
// import notification from "./notification/notification";
const indexRoute = (0, express_1.Router)();
indexRoute.use("/user", user_1.default);
indexRoute.use("/vcard", vcard_1.default);
indexRoute.use("/card", card_1.default);
indexRoute.use("/uploads", uploadFile_1.default);
indexRoute.use("/dashboard", dashboard_1.default);
indexRoute.use("/features", features_1.default);
// indexRoute.use("/profile",profileRoute);
// indexRoute.use("/staticData",staticDataRoute);
// indexRoute.use("/subscription",subscriptionRoute);
// indexRoute.use("/order",orderRoute);
// indexRoute.use("/vkardz",vkardzRoute);
// indexRoute.use("/affiliate", affiliateRoute);
// // indexRoute.use("/aboutUs", aboutusRoute);
// indexRoute.use("/services", serviceRoute);
// indexRoute.use("/setPassword", setUserPassword);
// indexRoute.use("/sendNotification", notification);
exports.default = indexRoute;
