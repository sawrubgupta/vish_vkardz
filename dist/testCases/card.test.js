"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_http_1 = __importDefault(require("chai-http"));
const chai_1 = __importDefault(require("chai"));
const index_1 = __importDefault(require("../index"));
const development_1 = __importDefault(require("../api/v1/config/development"));
const utility = __importStar(require("../api/v1/helper/utility"));
chai_1.default.should();
chai_1.default.use(chai_http_1.default);
let token = development_1.default.token;
let randomString = utility.randomString(8);
let email = 'test' + utility.randomString(8) + '@gmail.com';
let phone = utility.randomNumber(10);
describe("dashboard API", () => {
    describe("post /addCart", () => {
        /*it("Should add products to cart", (done) => {
            chai.request(app)
            .post("/api/v1/card/addCart")
            .set("Authorization", "Bearer " + token)
            .send({
                "productId":52,
                "qty":1
            })
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })*/
        /*it("Should check products already add to cart", (done) => {
            chai.request(app)
            .post("/api/v1/card/addCart")
            .set("Authorization", "Bearer " + token)
            .send({
                "productId":52,
                "qty":1
            })
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(400);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })*/
    });
    // ===================================================
    describe("GET /getCart", () => {
        it("Should get cart", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/getCart")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /removeFromCart", () => {
        it("Should remove from cart", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/card/removeFromCart?productId=52")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("PATCH /updateCartQty", () => {
        /*it("Should update cart qty", (done) => {
            chai.request(app)
            .patch("/api/v1/card/updateCartQty")
            .set("Authorization", "Bearer " + token)
            .send({
                "productId":52,
            "    qty":3
            })
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })*/
        it("Should shown error when cart qty is 0", (done) => {
            chai_1.default.request(index_1.default)
                .patch("/api/v1/card/updateCartQty")
                .set("Authorization", "Bearer " + token)
                .send({
                "productId": 52,
                "qty": 0
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(400);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("post /addToWishlist", () => {
        it("Should add products to wishlist", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/addToWishlist?productId=50")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should shown error when product id is null", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/addToWishlist?productId")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(400);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /getWishlist", () => {
        it("Should get wishlist", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/getWishlist")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("DELETE /removeFromWishlist", () => {
        it("Should remove item from wishlist", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/card/removeFromWishlist?productId=50")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should shown error when product id is null", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/card/removeFromWishlist?productId")
                .set("Authorization", "Bearer" + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /checkCouponCode", () => {
        // it("Should check coupon code", (done) => {
        //     chai.request(app)
        //     .get("/api/v1/card/checkCouponCode?couponCode=CARDPAY10")
        //     .end((err, response) => {
        //         if(err) return done(err)
        //         response.should.have.status(200);
        //         response.body.should.have.property('status');
        //         response.body.should.have.property('data');
        //         response.body.should.have.property('message');
        //         done();
        //     })
        // })
        it("Should getting error wehn coupon code is null", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/checkCouponCode?couponCode=")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("post /redeemCoupon", () => {
        it("Should reedem coupon", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/redeemCoupon")
                .set("Authorization", "Bearer " + token)
                .send({
                "couponCode": "CARDPAY10",
                "totalDiscount": 10
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should invalid coupon code", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/redeemCoupon")
                .set("Authorization", "Bearer" + token)
                .send({
                "couponCode": "CARDPAY10",
                "totalDiscount": 10
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("post /addDeliveryAddress", () => {
        it("Should add delivery addresses", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/addDeliveryAddress")
                .set("Authorization", "Bearer " + token)
                .send({
                "name": "Vishal Pathriya",
                "addressType": "home",
                "phone": "8209003362",
                "address": "c-scheme",
                "locality": "bus stand",
                "city": "jaipur",
                "state": "rajasthan",
                "pincode": 302031
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should shown error when required feilds is null", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/addDeliveryAddress")
                .set("Authorization", "Bearer" + token)
                .send({
                "name": "",
                "addressType": "",
                "phone": "",
                "address": "",
                "locality": "",
                "city": "",
                "state": "",
                "pincode": ""
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /getDeliveryAddress", () => {
        it("Should get delivery addresses", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/getDeliveryAddress")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("DELETE /deleteAddress", () => {
        it("Should delete delivery addresse", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/card/deleteAddress?addressId=1")
                .set("Authorization", "Bearer " + token)
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /getCategory", () => {
        it("Should get categories", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/getCategory")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /productList", () => {
        it("Should get categories", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/productList?categoryId=18&keyword=&page=1")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should shown error when cateory id is null", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/productList?categoryId=&keyword=&page=1")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(400);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("post /customizeCard", () => {
        it("Should add customize card", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/customizeCard")
                .set("Authorization", "Bearer " + token)
                .send({
                "productId": 50,
                "name": "Vishal",
                "designation": "",
                "qty": 1,
                "logo": ""
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should shown error when required feilds is null", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/customizeCard")
                .set("Authorization", "Bearer" + token)
                .send({
                "productId": 0,
                "name": "",
                "designation": "",
                "qty": 0,
                "logo": ""
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("post /purchaseCard", () => {
        it("Should purchase card", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/purchaseCard")
                .set("Authorization", "Bearer " + token)
                .send({
                "orderType": "online",
                "coinReedem": true,
                "reedemCoins": {
                    "coins": 210
                },
                "deliveryDetails": {
                    "name": "vishal",
                    "phoneNumber": "+91 8209003362",
                    "email": "vishalpathriya29@gmail.com",
                    "country": "india",
                    "city": "jaipur",
                    "locality": "jamdoli",
                    "address": "agra road",
                    "pincode": 302031,
                    "vat_number": ""
                },
                "paymentInfo": {
                    "username": "arpitk",
                    "email": "name1234@gmail.com",
                    "deliveryCharge": 0,
                    "price_currency_code": "currency_code",
                    "price": 193,
                    "paymentType": "razorpay",
                    "txnId": "v343hu55r34r",
                    "status": "1",
                    "note": ""
                },
                "orderlist": [{
                        "product_id": 7,
                        "qty": 5,
                        "sub_total": "109"
                    },
                    {
                        "product_id": 4,
                        "qty": 2,
                        "sub_total": "100"
                    }
                ]
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should pass wrong order type", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/purchaseCard")
                .set("Authorization", "Bearer" + token)
                .send({
                "orderType": "cehdjh",
                "coinReedem": true,
                "reedemCoins": {
                    "coins": 210
                },
                "deliveryDetails": {
                    "name": "vishal",
                    "phoneNumber": "+91 8209003362",
                    "email": "vishalpathriya29@gmail.com",
                    "country": "india",
                    "city": "jaipur",
                    "locality": "jamdoli",
                    "address": "agra road",
                    "pincode": 302031,
                    "vat_number": ""
                },
                "paymentInfo": {
                    "username": "arpitk",
                    "email": "name1234@gmail.com",
                    "deliveryCharge": 0,
                    "price_currency_code": "currency_code",
                    "price": 193,
                    "paymentType": "razorpay",
                    "txnId": "v343hu55r34r",
                    "status": "1",
                    "note": ""
                },
                "orderlist": [{
                        "product_id": 7,
                        "qty": 5,
                        "sub_total": "109"
                    },
                    {
                        "product_id": 4,
                        "qty": 2,
                        "sub_total": "100"
                    }
                ]
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
        it("Should not pass requied feilds", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/card/purchaseCard")
                .set("Authorization", "Bearer" + token)
                .send({
                "orderType": "cehdjh",
                "coinReedem": true,
                "reedemCoins": {
                    "coins": 210
                },
                "deliveryDetails": {
                    "name": "",
                    "phoneNumber": "",
                    "email": "",
                    "country": "india",
                    "city": "jaipur",
                    "locality": "jamdoli",
                    "address": "agra road",
                    "pincode": 302031,
                    "vat_number": ""
                },
                "paymentInfo": {
                    "username": "arpitk",
                    "email": "",
                    "deliveryCharge": 0,
                    "price_currency_code": "",
                    "price": 193,
                    "paymentType": "",
                    "txnId": "",
                    "status": "1",
                    "note": ""
                },
                "orderlist": [{
                        "product_id": 7,
                        "qty": 5,
                        "sub_total": "109"
                    },
                    {
                        "product_id": 4,
                        "qty": 2,
                        "sub_total": ""
                    }
                ]
            })
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(401);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /productsFaq", () => {
        it("Should get frenquantly ask question for products", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/card/productsFaq?productId=18")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
});
