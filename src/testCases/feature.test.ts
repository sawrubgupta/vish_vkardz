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

    describe("PUT /aboutUs", () => {
        it("Should add or update about us ", (done) => {
            chai.request(app)
            .put("/api/v1/features/aboutUs")
            .set("Authorization", "Bearer " + token)
            .send({
                "companyName":"ccdnm",
                "year":"2019",  
                "business":"hsb",
                "aboutUsDetail":"cjns cnsj s",
                "image":""
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

    describe("GET /aboutUs", () => {
        it("Should get abouts", (done) => {
            chai.request(app)
            .get("/api/v1/features/aboutUs")
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

    describe("DELETE /deleteAboutUs", () => {
        it("Should delete about us", (done) => {
            chai.request(app)
            .delete("/api/v1/features/deleteAboutUs")
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

    describe("post /addProducts", () => {
        it("Should add products ", (done) => {
            chai.request(app)
            .post("/api/v1/features/addProducts")
            .set("Authorization", "Bearer " + token)
            .send({
                "title":"sks",
                "description":"jnesjn",
                "price":"$300",
                "image":"" 
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

    describe("GET /getProducts", () => {
        it("Should get products", (done) => {
            chai.request(app)
            .get("/api/v1/features/getProducts?page=1")
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

    describe("PATCH /updateProduct", () => {
        it("Should update products", (done) => {
            chai.request(app)
            .patch("/api/v1/features/updateProduct?productId=383")
            .set("Authorization", "Bearer " + token)
            .send({
                "title":"sks",
                "description":"jnesjn",
                "price":"$300",
                "image":""
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

    describe("DELETE /deleteProduct", () => {
        it("Should delete products ", (done) => {
            chai.request(app)
            .delete("/api/v1/features/deleteProduct?productId=379")
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

    describe("POST /portfolio", () => {
        it("Should add portfolio", (done) => {
            chai.request(app)
            .post("/api/v1/features/portfolio")
            .set("Authorization", "Bearer " + token)
            .send({
                "image": "uploads/portfolio/" 
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
        it("Should check image is null", (done) => {
            chai.request(app)
            .post("/api/v1/features/portfolio")
            .set("Authorization", "Bearer " + token)
            .send({
                "image": "" 
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

    describe("GET /getPortfolio", () => {
        it("Should get portfolio ", (done) => {
            chai.request(app)
            .get("/api/v1/features/getPortfolio?page=1")
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

    describe("DELETE /deletePortfolio", () => {
        it("Should delete portflio", (done) => {
            chai.request(app)
            .delete("/api/v1/features/deletePortfolio")
            .set("Authorization", "Bearer " + token)
            .send({
                "portfolioId":[172, 426]
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

    describe("GET /getAppointments", () => {
        it("Should get appointments", (done) => {
            chai.request(app)
            .get("/api/v1/features/getAppointments?page=1")
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

    describe("GET /enquiryList", () => {
        it("Should get enquiry list ", (done) => {
            chai.request(app)
            .get("/api/v1/features/enquiryList?page=1")
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

    describe("GET /getUserFeature", () => {
        it("Should get user feature ", (done) => {
            chai.request(app)
            .get("/api/v1/features/getUserFeature")
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

     describe("PATCH /updateFeatures", () => {
        it("Should update features", (done) => {
            chai.request(app)
            .patch("/api/v1/features/updateFeatures")
            .set("Authorization", "Bearer " + token)
            .send({
                "features":[
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