process.env.NODE_ENV = 'test';

var server = require('../index');
var User = require('../models/User');
var Event = require('../models/Events');
var chai = require('chai');
var chaiHttp = require('chai-http');
const { expect } = chai;
const Config = require('config');
const JWT = require("jsonwebtoken");
const Bcrypt = require('bcrypt');

chai.use(chaiHttp);

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudHMiOltdLCJfaWQiOiI1ZGVmOWExM2Q2NmU1YzNlMDUyNGFhYzciLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicGFzc3dvcmQiOiIkMmIkMTAkMGJVZWhZWmc4T015SUs2b1lNby5QLjNsaTk2a3dKY2pKc01rejJIeFNFRjMuR3ljaUdxa2EiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiYWdlIjoxMiwiX192IjowLCJpYXQiOjE1NzU5ODM2MzV9.oRUg5ry8HHQRbU1h23Qidfp-ze0kKWH1VNbTfCEHBH8";


describe('Users', () => {

    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('/Post Register', () => {
        it('it should register a new user ', (done) => {

            var user_data = {
                "username": "testuser",
                "password": "112233",
                "email": "test@gmail.com",
                "age": 12
            }

            chai.request(server)
                .post('/users/register')
                .send(user_data)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.equals(true);
                    done();
                });

        });
    });


    describe('/Post Register', () => {
        it('it should not register a new user as it already exists', (done) => {

            var user_data = {
                "username": "testuser",
                "password": "112233",
                "email": "test@gmail.com",
                "age": 12
            }

            User.create(user_data, (err, user) => {
                chai.request(server)
                    .post('/users/register')
                    .send(user_data)
                    .end((err, res) => {
                        expect(res).to.have.status(500);
                        expect(res.body.success).to.equals(false);
                        done();
                    });
            })

        });
    });


    describe('/Post Login', () => {
        it('it should login user', (done) => {

            var user_data = {
                username: "testuser",
                password: "112233",
                email: "test@gmail.com",
                age: 12
            }

            var encrypted_user = {
                username: "testuser",
                password: "112233",
                email: "test@gmail.com",
                age: 12
            };
            encrypted_user.password = Bcrypt.hashSync(user_data.password, 10);

            User.create(encrypted_user, (err, user) => {
                if (err)
                    console.log(err);

                chai.request(server)
                    .post('/users/login')
                    .send(user_data)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.success).to.equals(true);
                        done();
                    });
            });
        });
    });

    describe('/Get findAllUsersAndTheirEvents', () => {
        it('it should return all users and their events ', (done) => {

            var user1 = {
                username: "testuser",
                password: "112233",
                email: "test@gmail.com",
                age: 12
            };
            user1.password = Bcrypt.hashSync(user1.password, 10);

            var user2 = {
                username: "testuser2",
                password: "112233",
                email: "test2@gmail.com",
                age: 13
            };
            user2.password = Bcrypt.hashSync(user2.password, 10);

            User.create(user1, (err, user1Created) => {
                var event1 = {
                    "start": 1563312312221,
                    "end": 1563312412224,
                    "title": "christmas festival",
                    "details": "event",
                    "ownerId": user1Created._id,
                    "location": {
                        "address": "somewhere",
                        "lngLat": {
                            "type": "Point",
                            "coordinates": [123, 121]
                        }
                    }
                };

                var offest = new Date().getTimezoneOffset() * 60 * 1000;
                event1.start = new Date(event1.start) - new Date(event1.start).getMinutes() * 1000 - offest
                event1.end = new Date(event1.end) - new Date(event1.end).getMinutes() * 1000 - offest;
                Event.create(event1, (err, event) => {

                    User.findOneAndUpdate({ _id: user1Created._id }, { $push: { events: event._id } }, (err, found_user) => {
                        User.create(user2, (err, user2Created) => {
                            chai.request(server)
                                .get('/users/findAllUsersAndTheirEvents')
                                .set('Authorization', 'bearer ' + token)
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res.body.success).to.equals(true);
                                    expect(res.body.data).to.have.lengthOf(2);
                                    expect(res.body.data[0]._id).to.equals(String(user1Created._id));
                                    expect(res.body.data[1]._id).to.equals(String(user2Created._id));
                                    expect(res.body.data[0].events[0].details).to.equals("event");
                                    done();
                                });
                        });
                    });
                });


            });

        });
    });
});

