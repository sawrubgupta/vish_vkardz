import {Router} from "express";

import * as homeController from '../../controller/dashboard/home';

const dashboardRouter = Router();

dashboardRouter.get("/home", homeController.home);

export default dashboardRouter;