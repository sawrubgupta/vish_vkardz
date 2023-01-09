import chaiHttp from "chai-http";
import chai from "chai";
import app from "../index";
import config from '../api/v1/config/development';
import * as utility from '../api/v1/helper/utility';

chai.should();
chai.use(chaiHttp);

let token = config.token;
let randomString = utility.randomString(8)
let email = 'test' + utility.randomString(8) + '@gmail.com';
let phone = utility.randomNumber(10);

describe("vcard API", () => {

    describe("POST /activateCard", () => {
        it("Should invalid code", (done) => {
            chai.request(app)
            .post("/api/v1/vcard/activateCard")
            .set("Authorization", "Bearer " + token)
            .send({
                "username": "testing12",
                "code": "000000"
            })
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(400);     
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })
        it("Should code aready used", (done) => {
            chai.request(app)
            .post("/api/v1/vcard/activateCard")
            .set("Authorization", "Bearer " + token)
            .send({
                "username": "testing12",
                "code": "627656"
            })
            .end((err, response) => {
                if(err) return done(err)
    
                response.should.have.status(400);     
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })
    })
    
// ===================================================

    describe("GET /deactivateCard", () => {
        it("Should deactivate card", (done) => {
            chai.request(app)
            .get("/api/v1/vcard/deactivateCard")
            .set("Authorization", "Bearer " + token)
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

    describe("GET /getSocialLinkd", () => {
        it("Should get your social links", (done) => {
            chai.request(app)
            .get("/api/v1/vcard/getSocialLinks")
            .set("Authorization", "Bearer " + token)
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

    describe("GET /getVcardProfile", () => {
        it("Should get vcard profile data", (done) => {
            chai.request(app)
            .get("/api/v1/vcard/getVcardProfile")
            .set("Authorization", "Bearer " + token)
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

    describe("PATCH /updateSocialLinks", () => {
        it("Should update social link ", (done) => {
            chai.request(app)
            .patch("/api/v1/vcard/updateSocialLinks")
            .set("Authorization", "Bearer " + token)
            .send({
                "socialSites": [{
                    "siteId": 1,
                    "siteValue": "Facebook",
                    "orders": 3,
                    "siteLabel": "Facebook"
                },{
                    "siteId": 2,
                    "siteValue": "Facebook",
                    "orders": 3,
                    "siteLabel": "Facebook"
                }]
            })
            .end((err, response) => {
                if(err) return done(err)
            
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

    describe("DELETE /deleteSocialLink", () => {
        it("Should delete social link ", (done) => {
            chai.request(app)
            .delete("/api/v1/vcard/deleteSocialLink?siteId=1")
            .set("Authorization", "Bearer " + token)
            .end((err, response) => {
                if(err) return done(err)
    
                response.should.have.status(200);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

})