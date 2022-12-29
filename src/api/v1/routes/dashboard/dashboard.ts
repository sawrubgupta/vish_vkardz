import {Router} from "express";

import * as homeController from '../../controller/dashboard/home';
import * as mixingDataController from '../../controller/dashboard/mixingData';

const dashboardRouter = Router();

dashboardRouter.get("/home", homeController.home);
dashboardRouter.get("/mixingData", mixingDataController.mixingData);

export default dashboardRouter;