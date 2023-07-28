import {Router} from "express";

import * as transactionController from '../../controller/orders/transaction';
import * as orderController from '../../controller/orders/order';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const orderRouter = Router();

orderRouter.get("/getTransactions", authenticatingToken, transactionController.transactionHistory);
orderRouter.get("/orderList", authenticatingToken, orderController.orderHistory);
orderRouter.post("/cancelOrder", authenticatingToken, orderController.cancelOrder);
orderRouter.get("/orderSummary", authenticatingToken, orderController.orderSummary);

export default orderRouter;