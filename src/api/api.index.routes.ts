import {Router} from "express";

import apiV1Router from "./v1/routes/index.route";
import corporateAdminRouter from "./corporateAdmin/controller/index.route";
import uploadBucketRoute from "../api/v1/controller/testImage/imageUpload";


const indexRoute = Router();

indexRoute.use("/v1", apiV1Router);
indexRoute.use("/v1/admin", corporateAdminRouter);
indexRoute.use("/zaruiPapers", uploadBucketRoute);


export default indexRoute;
