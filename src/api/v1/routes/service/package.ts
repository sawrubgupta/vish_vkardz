import {Router} from "express";

import * as packageController from '../../controller/services/package';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const serviceRouter = Router();

serviceRouter.patch("/updatePackage", authenticatingToken, validation.updatePackageValidation, packageController.updatePackage);
serviceRouter.get("/getPackageList", packageController.getPackage);

export default serviceRouter;
