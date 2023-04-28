import {Router} from "express";

import adminAuthRoute from './admin/index';
import profileRoute from "./profile";

const corporateAdminRoute = Router();

corporateAdminRoute.use("/auth", adminAuthRoute);
corporateAdminRoute.use("/profile", profileRoute);

export default corporateAdminRoute;
