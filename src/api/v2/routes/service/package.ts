import {Router} from "express";

import * as oldPackageController from '../../controller/services/package';
import * as updatePackageController from '../../controller/services/updateUserPackage';


import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const serviceRouter = Router();

serviceRouter.patch("/package", authenticatingToken, validation.oldUpdatePackageValidation, oldPackageController.updatePackage);
serviceRouter.get("/getPackageList", oldPackageController.getPackage);

serviceRouter.patch("/updatePackage", authenticatingToken, validation.updatePackageValidation, updatePackageController.updatePackage);

export default serviceRouter;
