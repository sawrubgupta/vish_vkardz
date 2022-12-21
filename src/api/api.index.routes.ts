import {Router} from "express";

import apiV1Router from "./v1/routes/index.route";

const indexRoute = Router();

indexRoute.use("/v1", apiV1Router);

export default indexRoute;
