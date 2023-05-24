import {Router} from "express";

import adminAuthRoute from './admin/index';
import profileRoute from "./profile/index";
import teamRoute from "./teams/index";

const corporateAdminRoute = Router();

corporateAdminRoute.use("/auth", adminAuthRoute);
corporateAdminRoute.use("/profile", profileRoute);
corporateAdminRoute.use("/teams", teamRoute);

export default corporateAdminRoute;
