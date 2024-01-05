import {Router} from "express";

import * as homeController from '../../controller/dashboard/home';
import * as mixingDataController from '../../controller/dashboard/mixingData';
import * as dealsController from '../../controller/dashboard/deals';
import * as contactsController from '../../controller/dashboard/contactSync';
import * as tutorialsController from '../../controller/dashboard/tutorials';

import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

const dashboardRouter = Router();

dashboardRouter.get("/home", tempAuthenticatingToken, homeController.home);
dashboardRouter.get("/bestSellerProducts", tempAuthenticatingToken, homeController.bestSellerProducts);
dashboardRouter.get("/mixingData", mixingDataController.mixingData);
dashboardRouter.get("/DealsOfTheDay", dealsController.dealOfTheDay);
dashboardRouter.get("/recommendedProducts", tempAuthenticatingToken, homeController.recommendedProducts);//not used

dashboardRouter.get("/videoTutorials", tutorialsController.tutorials);//not used

dashboardRouter.post("/contactSync", contactsController.contactSync);

dashboardRouter.get("/test", mixingDataController.test);

//for daa transfer only----
// import * as dbDataTransfer from '../../controller/dashboard/dbDataTransfer';
// dashboardRouter.post("/userToUserProfileDataTransfer", authenticatingToken, dbDataTransfer.userToUserProfileDataTransfer);
// dashboardRouter.post("/addUserNewFeature", authenticatingToken, dbDataTransfer.addUserNewFeature);
// dashboardRouter.post("/vcInfoDataAdd", authenticatingToken, dbDataTransfer.vcInfoDataAdd);
// dashboardRouter.post("/cardDataTransfer", authenticatingToken, dbDataTransfer.cardDataTransfer);

export default dashboardRouter;