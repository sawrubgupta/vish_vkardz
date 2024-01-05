import {Router} from "express";

import adminAuthRoute from './admin/index';
import profileRoute from "./profile/index";
import teamRoute from "./teams/index";
// import profileV2Route from "./profileV2/index";

const corporateAdminRoute = Router();

corporateAdminRoute.use("/auth", adminAuthRoute);
corporateAdminRoute.use("/profile", profileRoute);
corporateAdminRoute.use("/teams", teamRoute);
// corporateAdminRoute.use("/profile/V2", profileRoute);

export default corporateAdminRoute;
