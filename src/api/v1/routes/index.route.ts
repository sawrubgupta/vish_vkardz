import {Router} from "express";

import userRoute from "./user/user";
import vcardRoute from "./vcard/vcard";
import cardRoute from "./card/card";
import dashboardRoute from "./dashboard/dashboard";
import uploadRoute from "../controller/uploadFile/uploadFile";
import featuresRoute from "./features/features";
import profileRoute from "./profile/profile";
import invoiceRoute from "./invoice/invoice";
import orderRoute from "./order/order"
import referralRoute from "./referral/refer";
import followerRoute from "./follower/follow";
import serviceRoute from "./service/package";

// import staticDataRoute from "./static_data/staticData"
// import subscriptionRoute from "./subscription/subscription"
// import vkardzRoute from "./vkardz/vkardz"
// import affiliateRoute from "./affiliate/affiliate";
// import cardRoute from "./cart/card";
// // import aboutusRoute from "./aboutUs/aboutUs";
// import serviceRoute from "./services/service";
// import setUserPassword from "./userSetPassword/setPassword";
import notification from "./notification/notification";

const indexRoute = Router();

indexRoute.use("/user", userRoute);
indexRoute.use("/vcard",vcardRoute);
indexRoute.use("/card", cardRoute);
indexRoute.use("/uploads", uploadRoute);
indexRoute.use("/dashboard", dashboardRoute);
indexRoute.use("/features", featuresRoute);
indexRoute.use("/profile",profileRoute);
indexRoute.use("/invoice", invoiceRoute);
indexRoute.use("/order",orderRoute);
indexRoute.use("/refer", referralRoute);
indexRoute.use("/userFollow", followerRoute);
indexRoute.use("/service", serviceRoute);

// indexRoute.use("/staticData",staticDataRoute);
// indexRoute.use("/subscription",subscriptionRoute);
// indexRoute.use("/vkardz",vkardzRoute);
// indexRoute.use("/affiliate", affiliateRoute);
// // indexRoute.use("/aboutUs", aboutusRoute);
// indexRoute.use("/services", serviceRoute);
// indexRoute.use("/setPassword", setUserPassword);
indexRoute.use("/notification", notification);

export default indexRoute;
