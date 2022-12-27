import {Router} from "express";

import * as featureController from '../../controller/features/manageFeature';
import * as updateFeatureController from '../../controller/features/manageFeature';

import {authenticatingToken} from '../../middleware/authorization.controller';

const featureRouter = Router();

featureRouter.get("/getUserFeature", authenticatingToken, featureController.getFeatureByUserId);
featureRouter.patch("/updateFeatures", authenticatingToken, updateFeatureController.updateUserFeaturesStatus);

export default featureRouter;