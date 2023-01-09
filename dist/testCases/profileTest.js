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
    describe("GET /getProfile", () => {
        it("Should get your profile", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/profile/getProfile/")
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
    describe("POST /setProfilePin", () => {
        it("Should add profile security pin", (done) => {
            chai_1.default.request(index_1.default)
                .post("/api/v1/profile/setProfilePin")
                .set("Authorization", "Bearer " + token)
                .send({
                "isPasswordEnable": 1,
                "securityPin": "1234"
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
    describe("DELETE /removeProfilePin", () => {
        it("Should delete profile pin", (done) => {
            chai_1.default.request(index_1.default)
                .delete("/api/v1/profile/removeProfilePin")
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
    describe("GET /getLayots", () => {
        it("Should get vcard layouts", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/profile/getLayots")
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
    describe("PATCH /updateProfile", () => {
        /*it("Should update your profile", (done) => {
            chai.request(app)
            .patch("/api/v1/profile/updateProfile/")
            .set("Authorization", "Bearer " + token)
            .send({
                "name": "Vishal",
                "designation": "",
                "companyName": "",
                "dialCode": "+91",
                "phone": phone,
                "email": email,
                "website": "",
                "address":"jaipur"
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
        it("Should check email and phone already used", (done) => {
            chai_1.default.request(index_1.default)
                .patch("/api/v1/profile/updateProfile/")
                .set("Authorization", "Bearer " + token)
                .send({
                "name": "Vishal",
                "designation": "",
                "companyName": "",
                "dialCode": "+91",
                "phone": "8209003362",
                "email": "vishalpathriya29@gmail.com",
                "website": "",
                "address": "jaipur"
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
    describe("PATCH /updateImage", () => {
        it("Should update your pitures", (done) => {
            chai_1.default.request(index_1.default)
                .patch("/api/v1/profile/updateImage/")
                .set("Authorization", "Bearer " + token)
                .send({
                "profileImage": "",
                "coverImage": ""
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
    describe("PATCH /updateVcardLayout", () => {
        it("Should update vcard layout", (done) => {
            chai_1.default.request(index_1.default)
                .patch("/api/v1/profile/updateVcardLayout/")
                .set("Authorization", "Bearer " + token)
                .send({
                "profileColor": "",
                "styleId": ""
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
