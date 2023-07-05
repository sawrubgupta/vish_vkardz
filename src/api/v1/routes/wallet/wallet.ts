import {Router} from "express";

import * as referController from '../../controller/wallet/refer';
import * as coinsController from '../../controller/wallet/wallet';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const walletRouter = Router();

walletRouter.get("/checkReferralCode", referController.checkReferCode);
walletRouter.post("/applyReferCode", authenticatingToken, referController.useReferCode);

walletRouter.get("/walletHistory", authenticatingToken, coinsController.coinHistory);
walletRouter.post("/reedemCouponCoin", authenticatingToken, coinsController.reedemCouponCoin);

export default walletRouter;