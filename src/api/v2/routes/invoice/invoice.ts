import {Router} from "express";

import * as invoiceController from '../../controller/invoice/invoice';

import {authenticatingToken} from '../../middleware/authorization.controller';

const invoiceRouter = Router();

invoiceRouter.get('/invoice', authenticatingToken, invoiceController.invoice);

export default invoiceRouter;
