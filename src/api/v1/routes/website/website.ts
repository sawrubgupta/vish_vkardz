import {Router} from "express";

import * as currencyController from '../../controller/website/currency';
import * as contactUsController from '../../controller/website/home';
import * as blogController from '../../controller/website/blog';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const websiteRouter = Router();

websiteRouter.get("/getCurrency", currencyController.currencyList);
websiteRouter.get("/blogs", blogController.blogList);
websiteRouter.post("/contactUs", validation.contactUsValidation, contactUsController.contactUs);

export default websiteRouter;