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
describe("profile API", () => {
    describe("PUT /aboutUs", () => {
        it("Should add or update about us ", (done) => {
            chai_1.default.request(index_1.default)
                .put("/api/v1/features/aboutUs")
                .set("Authorization", "Bearer " + token)
                .send({
                "companyName": "ccdnm",
                "year": "2019",
                "business": "hsb",
                "aboutUsDetail": "cjns cnsj s",
                "image": ""
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
    });
    // ===================================================
    describe("GET /aboutUs", () => {
        it("Should get abouts", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/features/aboutUs")
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
    describe("DELETE /deleteAboutUs", () => {
        it("Should delete about us", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/features/deleteAboutUs")
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
    describe("post /addProducts", () => {
        it("Should add products ", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/features/addProducts")
                .set("Authorization", "Bearer " + token)
                .send({
                "title": "sks",
                "description": "jnesjn",
                "price": "$300",
                "image": ""
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
    });
    // ===================================================
    describe("GET /getProducts", () => {
        it("Should get products", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/features/getProducts?page=1")
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
    describe("PATCH /updateProduct", () => {
        it("Should update products", (done) => {
            chai_1.default.request(index_1.default)
                .patch("/api/v1/features/updateProduct?productId=383")
                .set("Authorization", "Bearer " + token)
                .send({
                "title": "sks",
                "description": "jnesjn",
                "price": "$300",
                "image": ""
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
    });
    // ===================================================
    describe("DELETE /deleteProduct", () => {
        it("Should delete products ", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/features/deleteProduct?productId=379")
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
    describe("POST /portfolio", () => {
        it("Should add portfolio", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/features/portfolio")
                .set("Authorization", "Bearer " + token)
                .send({
                "image": "uploads/portfolio/"
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
        it("Should check image is null", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/features/portfolio")
                .set("Authorization", "Bearer " + token)
                .send({
                "image": ""
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
    describe("GET /getPortfolio", () => {
        it("Should get portfolio ", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/features/getPortfolio?page=1")
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
    describe("DELETE /deletePortfolio", () => {
        it("Should delete portflio", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/features/deletePortfolio")
                .set("Authorization", "Bearer " + token)
                .send({
                "portfolioId": [172, 426]
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
    });
    // ===================================================
    describe("GET /getAppointments", () => {
        it("Should get appointments", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/features/getAppointments?page=1")
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
    describe("GET /enquiryList", () => {
        it("Should get enquiry list ", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/features/enquiryList?page=1")
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
    describe("GET /getUserFeature", () => {
        it("Should get user feature ", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/features/getUserFeature")
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
    describe("PATCH /updateFeatures", () => {
        it("Should update features", (done) => {
            chai_1.default.request(index_1.default)
                .patch("/api/v1/features/updateFeatures")
                .set("Authorization", "Bearer " + token)
                .send({
                "features": [
                    {
                        "featureId": 3,
                        "status": 1
                    },
                    {
                        "featureId": 5,
                        "status": 1
                    },
                    {
                        "featureId": 6,
                        "status": 1
                    },
                    {
                        "featureId": 8,
                        "status": 1
                    },
                    {
                        "featureId": 10,
                        "status": 1
                    },
                    {
                        "featureId": 11,
                        "status": 1
                    },
                    {
                        "featureId": 13,
                        "status": 1
                    },
                    {
                        "featureId": 14,
                        "status": 1
                    },
                    {
                        "featureId": 15,
                        "status": 1
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
    });
    // ===================================================
});
