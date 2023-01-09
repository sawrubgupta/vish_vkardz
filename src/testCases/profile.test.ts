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

describe("profile API", () => {

    describe("GET /getProfile", () => {
        it("Should get your profile", (done) => {
            chai.request(app)
            .get("/api/v1/profile/getProfile/")
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

    describe("POST /setProfilePin", () => {
        it("Should add profile security pin", (done) => {
            chai.request(app)
            .post("/api/v1/profile/setProfilePin")
            .set("Authorization", "Bearer " + token)
            .send({
                "isPasswordEnable":1,
                "securityPin":"1234"
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

    describe("DELETE /removeProfilePin", () => {
        it("Should delete profile pin", (done) => {
            chai.request(app)
            .delete("/api/v1/profile/removeProfilePin")
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

    describe("GET /getLayots", () => {
        it("Should get vcard layouts", (done) => {
            chai.request(app)
            .get("/api/v1/profile/getLayots")
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
            chai.request(app)
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

    describe("PATCH /updateImage", () => {
        it("Should update your pitures", (done) => {
            chai.request(app)
            .patch("/api/v1/profile/updateImage/")
            .set("Authorization", "Bearer " + token)
            .send({
                "profileImage": "", 
                "coverImage": ""
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

    describe("PATCH /updateVcardLayout", () => {
        it("Should update vcard layout", (done) => {
            chai.request(app)
            .patch("/api/v1/profile/updateVcardLayout/")
            .set("Authorization", "Bearer " + token)
            .send({
                "profileColor": "", 
                "styleId": ""
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

})