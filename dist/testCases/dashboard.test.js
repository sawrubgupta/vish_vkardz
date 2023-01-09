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
    describe("GET /home", () => {
        it("Should get home data", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/dashboard/home?type=ORDER_NOW")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
    describe("GET /mixingData", () => {
        it("Should get data", (done) => {
            chai_1.default.request(index_1.default)
                .get("/api/v1/dashboard/mixingData")
                .end((err, response) => {
                if (err)
                    return done(err);
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('message');
                done();
            });
        });
    });
    // ===================================================
});
