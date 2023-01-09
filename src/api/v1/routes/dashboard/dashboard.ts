import {Router} from "express";

import * as homeController from '../../controller/dashboard/home';
import * as mixingDataController from '../../controller/dashboard/mixingData';
import * as dealsController from '../../controller/dashboard/deals';

const dashboardRouter = Router();

dashboardRouter.get("/home", homeController.home);
dashboardRouter.get("/mixingData", mixingDataController.mixingData);
dashboardRouter.get("/DealsOfTheDay", dealsController.dealOfTheDay);

export default dashboardRouter;