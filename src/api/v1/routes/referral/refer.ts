import {Router} from "express";

import * as referController from '../../controller/referral/refer';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const referralRouter = Router();

referralRouter.get("/checkReferralCode", referController.checkReferCode);
referralRouter.post("/applyReferCode", authenticatingToken, referController.useReferCode);

export default referralRouter;