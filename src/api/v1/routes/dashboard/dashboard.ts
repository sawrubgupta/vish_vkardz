import {Router} from "express";

import * as homeController from '../../controller/dashboard/home';
import * as mixingDataController from '../../controller/dashboard/mixingData';
import * as dealsController from '../../controller/dashboard/deals';
import * as contactsController from '../../controller/dashboard/contactSync';

const dashboardRouter = Router();

dashboardRouter.get("/home", homeController.home);
dashboardRouter.get("/mixingData", mixingDataController.mixingData);
dashboardRouter.get("/DealsOfTheDay", dealsController.dealOfTheDay);

dashboardRouter.post("/contactSync", contactsController.contactSync);

export default dashboardRouter;