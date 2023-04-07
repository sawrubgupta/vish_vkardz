import {Router} from "express";

import * as notificationController from '../../controller/notification/notification';
import {authenticatingToken} from '../../middleware/authorization.controller';


const notificationRouter = Router();

//orderRouter.get("/billing", authenticatingToken, checkDeliveryAvailController.getBilling);
notificationRouter.get("/notificationList", authenticatingToken, notificationController.getNotification);


export default notificationRouter;
