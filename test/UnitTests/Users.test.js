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


describe('Users', () => {

    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('/Post Register', () => {
        it('should register a new user ', (done) => {

            var user_data = UserTestHelpers.getTestUser1();

            chai.request(server)
                .post('/users/register')
                .send(user_data)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.success).to.equals(true);
                    done();
                });

        });

        it('should not register a new user as it already exists', (done) => {

            var user_data = UserTestHelpers.getTestUser1();

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
        it('should login user', (done) => {

            var user_data = UserTestHelpers.getTestUser1();
            var encrypted_user = UserTestHelpers.getEncryptedTestUser1();

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
        it('should return all users and their events ', (done) => {

            var user1 = UserTestHelpers.getEncryptedTestUser1();
            var user2 = UserTestHelpers.getEncryptedTestUser2();

            User.create(user1, (err, user1Created) => {
                var event1 = EventTestHelpers.getValidEvent1();

                var offest = new Date().getTimezoneOffset() * 60 * 1000;
                event1.start = new Date(event1.start) - new Date(event1.start).getMinutes() * 1000 - offest
                event1.end = new Date(event1.end) - new Date(event1.end).getMinutes() * 1000 - offest;

                Event.create(event1, (err, event) => {
                    User.findOneAndUpdate({ _id: user1Created._id }, { $push: { events: event._id } }, (err, found_user) => {
                        User.create(user2, (err, user2Created) => {
                            chai.request(server)
                                .get('/users/findAllUsersAndTheirEvents')
                                .set('Authorization', 'bearer ' + UserTestHelpers.Token)
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


