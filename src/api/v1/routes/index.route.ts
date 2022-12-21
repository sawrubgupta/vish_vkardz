import {Router} from "express";

import userRoute from './user/user';
import vcardRoute from "./vcard/vcard";
import cardRoute from "./cart/card";

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

const indexRoute = Router();

indexRoute.use("/user", userRoute);
indexRoute.use("/vcard",vcardRoute);
indexRoute.use("/card", cardRoute);

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

export default indexRoute;
