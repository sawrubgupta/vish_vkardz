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

describe("Users API", () => {
    
    describe("POST /register", () => {
        it("Should create a user", (done) => {
            chai.request(app)
            .post("/api/v1/user/socialRegister")
            .send({
                "name": "Vishal pathriya",
                "email": email,
                'password': "123456",
                'fcmToken': "token",
                'type': "email",
                'socialId': "",
                'dial_code': "+91",
                'phone': `${phone}`,
                'username': randomString,
                'country': 91,
                'country_name': ""
            })
            .end((err, response) => {
                if(err) return done(err)
                 
                response.should.have.status(200);
                response.body.should.have.property('status')
                response.body.should.have.property('token')
                response.body.should.have.property('data')
                response.body.should.have.property('message')
                done();
            })
        })

        it("Should check type", (done) => {
            chai.request(app)
            .post("/api/v1/user/socialRegister")
            .send({
                "name": "Vishal pathriya",
                "email": email,
                'password': "123456",
                'fcmToken': "token",
                'type': "ncuedjjnwk",
                'socialId': "",
                'dial_code': "+91",
                'phone': `${phone}`,
                'username': randomString,
                'country': 91,
                'country_name': ""
            })
            .end((err, response) => {
                if(err) return done(err)
                 
                response.should.have.status(400);
                response.body.should.have.property('status')
                response.body.should.have.property('data')
                response.body.should.have.property('message')
                done();
            })
        })

        it("Should check username, phone, email already registered or not", (done) => {
            chai.request(app)
            .post("/api/v1/user/socialRegister")
            .send({
                "name": "Vishal pathriya",
                "email": "vp9252@gmail.com",
                'password': "123456",
                'fcmToken': "token",
                'type': "ncuedjjnwk",
                'socialId': "",
                'dial_code': "+91",
                'phone': "123224544",
                'username': "vp9252",
                'country': 91,
                'country_name': ""
            })
            .end((err, response) => {
                if(err) return done(err)
                 
                response.should.have.status(400);
                response.body.should.have.property('status')
                response.body.should.have.property('data')
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

    describe('POST /login', () => {
        it('Should login user and return auth token', (done) => {
            var email = "vishalpathriya9252@gmail.com";
            var password = "123456";
            var fcmToken = "token";
            var type = "email";
            var socialId = "";

            chai.request(app)
            .post('/api/v1/user/socialLogin')
            .send({email, password, fcmToken, type, socialId})
            .end((err, res) => {
                if(err) return done(err)

                res.should.have.status(200);
                res.body.should.have.property('token')
                res.body.should.have.property('data')
                res.body.should.have.property('message')
                done();
                console.log(res.body.token);
            })
        })
        it('Should return error if wrong pass / email provided', (done) => {
            var email = "vishalpathriya9252@gmail.com";
            var password = "1234566";
            var fcmToken = "token";
            var type = "email";
            var socialId = "";

            chai.request(app)
            .post('/api/v1/user/socialLogin')
            .send({email, password, fcmToken, type, socialId})
            .end((err, res) => {
                if(err) return done(err)

                res.should.have.status(400);
                res.body.should.have.property('data')
                res.body.should.have.property('message')
                done();
                })
        })
        it('Should check email is not registered', (done) => {
            var email = "vishalpathriya9252@gmail.com";
            var password = "1234566";
            var fcmToken = "token";
            var type = "email";
            var socialId = "";

            chai.request(app)
            .post('/api/v1/user/socialLogin')
            .send({email, password, fcmToken, type, socialId})
            .end((err, res) => {
                if(err) return done(err)

                res.should.have.status(400);
                res.body.should.have.property('data')
                res.body.should.have.property('message')
                done();
                })
        })

    })

// ===================================================

    describe("POST /setting", () => {
        it("Should update user settings", (done) => {
            chai.request(app)
            .post("/api/v1/user/setting")
            .set("Authorization", "Bearer " + token)
            .send({
                "pushNotificationEnable":true,
                "emailNotificationEnable":false,
                "currencyCode":"AED",
                "languageSelection":"hi"
            })
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status');
                response.body.should.have.property('message')
                done();
            })
        })
    })
    
// ===================================================

    describe("GET /getCountryList", () => {
        it("Should get country list", (done) => {
            chai.request(app)
            .get("/api/v1/user/getCountryList")
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                // response.text.should.be.eq("not exist");
                // response.body.should.be.a('object');
                response.body.should.have.property('status');
                response.body.should.have.property('data')
                done();
            })
        })
    })
    
// ===================================================

    describe("GET /checkUsername", () => {
        it("Should check username", (done) => {
            chai.request(app)
            .get("/api/v1/user/checkUsername?username=z")
            .end((err: any, response: any) => {
                if(err) return done(err)

                response.body.should.have.property('status')
                response.body.should.have.property('message')
                done();
            })
        })
    })

// ===================================================

    describe("POST /forgotPassword", () => {
        /*it("Should sent a new password on your mail", (done) => {
            chai.request(app)
            .post("/api/v1/user/forgotPassword")
            .send({"email":"vishalp@gmail.com"})
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(200);
                // response.body.should.be.a('object');
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            })
        })*/    
        it("Should check email registered or not", (done) => {
            chai.request(app)
            .post("/api/v1/user/forgotPassword")
            .send({"email":"xyzcab@gmail.com"})
            .end((err, response) => {
                if(err) return done(err)

                response.should.have.status(400);
                response.body.should.have.property('status');
                response.body.should.have.property('data');
                response.body.should.have.property('message');
                done();
            })
        })
    })

// ===================================================

    describe("PATCH /changePassword", () => {
        it("Should old pasword is not correct", (done) => {
            chai.request(app)
            .patch("/api/v1/user/changePassword")
            .set("Authorization", "Bearer " + token)
            .send({
                "oldPassword":"asd12300",
                "newPassword":"asd12300"
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

})