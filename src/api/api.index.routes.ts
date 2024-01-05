import {Router} from "express";

import apiV1Router from "./v1/routes/index.route";
import corporateAdminRouter from "./corporateAdmin/controller/index.route";
import uploadBucketRoute from "../api/v1/controller/testImage/imageUpload";
import apiV2Router from "./v2/routes/index.route";
import corporateAdminV2Router from "./corporateAdminV2/controller/index.route";

const indexRoute = Router();

// indexRoute.use("/v1", apiV1Router);
indexRoute.use("/v2", apiV2Router);
indexRoute.use("/v1/admin", corporateAdminRouter);
indexRoute.use("/v2/admin", corporateAdminV2Router);



export default indexRoute;
