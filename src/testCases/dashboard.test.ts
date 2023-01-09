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

describe("dashboard API", () => {
    
    describe("GET /home", () => {
        it("Should get home data", (done) => {
            chai.request(app)
            .get("/api/v1/dashboard/home?type=ORDER_NOW")
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

    describe("GET /mixingData", () => {
        it("Should get data", (done) => {
            chai.request(app)
            .get("/api/v1/dashboard/mixingData")
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

})
