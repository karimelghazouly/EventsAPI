process.env.NODE_ENV = 'test';

var server = require('../../index');
var User = require('../../models/User');
var Event = require('../../models/Events');
var chai = require('chai');
var chaiHttp = require('chai-http');
const { expect } = chai;
const EventTestHelpers = require('../TestHelpersFunctions/EventTestHelpers');
const UserTestHelpers = require('../TestHelpersFunctions/UsersTestHelpers');

chai.use(chaiHttp);
Token = ""
describe('Integeration Test User, Events', () => {

    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            Event.deleteMany({}, (err) =>{
                Token = "";
                var user_data = UserTestHelpers.getTestUser1();
                chai.request(server)
                    .post('/users/register')
                    .send(user_data)
                    .end((err, res) => {
                        Token = res.body.token;
                        done();
                    });
            })
        });
    });

    describe('/Post Login', () => {
        it('should register then Login user ', (done) => {
            var user_data = UserTestHelpers.getTestUser1();
            chai.request(server)
            .post('/users/login')
            .send(user_data)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.success).to.equals(true);
                done();
            });
        });

        it('should not register a new user as it already exists', (done) => {
            var user_data = UserTestHelpers.getTestUser1();
            chai.request(server)
            .post('/users/register')
            .send(user_data)
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.success).to.equals(false);
                done();
            });
        });
    });

    describe('/Post Add Event', () => {
        it('it should create event', (done) => {

            var EventData = EventTestHelpers.getValidEvent1();

            chai.request(server)
                .post('/events/addEvent')
                .set('Authorization', 'bearer ' + Token)
                .send(EventData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.equals(true);
                    done();
                });
        });

        it('it should not create event', (done) => {

            var EventData = EventTestHelpers.getValidEvent1();

            chai.request(server)
                .post('/events/addEvent')
                .set('Authorization', 'bearer ' + "12312312xzcxzcasdsad")
                .send(EventData)
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    expect(res.body.success).to.equals(false);
                    done();
                });
        });
    });


    describe('/Post Get Event', () => {
        it('it should create event then fetches all', (done) => {

            var EventData = EventTestHelpers.getValidEvent1();

            chai.request(server)
                .post('/events/addEvent')
                .set('Authorization', 'bearer ' + Token)
                .send(EventData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.equals(true);
                    chai.request(server)
                        .get('/events/getEvents')
                        .set('Authorization', 'bearer ' + Token)
                        .send(EventData)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.success).to.equals(true);
                            expect(res.body.events).to.have.lengthOf(1);
                            done();
                        });
                });
        });

       
    });

    

});


