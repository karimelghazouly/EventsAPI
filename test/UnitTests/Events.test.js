process.env.NODE_ENV = 'test';

const server = require('../../index');
const Event = require('../../models/Events');
const User = require('../../models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const EventTestHelpers = require('../TestHelpersFunctions/EventTestHelpers');
const UserTestHelpers = require('../TestHelpersFunctions/UsersTestHelpers');

chai.use(chaiHttp);

describe('Events', () => {

  beforeEach((done) => {
    // Clear all the database before running any test
    Event.deleteMany({}, (err) => {
      User.deleteMany({}, (err) => {
        // add only the user that we will use it's token
        user_data = UserTestHelpers.getTestUser1();
        User.create(user_data);
        done();
      });
    });
  });

  describe('/GET getEvents', () => {
    it('it should GET all the events', (done) => {
      var event1 = EventTestHelpers.getValidEvent1();
      var event2 = EventTestHelpers.getValidEvent2();

      Event.create(event1, (err, event) => {
        Event.create(event2, (err, event) => {

          chai.request(server)
            .get('/events/getEvents')
            .set('Authorization', 'bearer ' + EventTestHelpers.Token)
            .end((err, res) => {

              expect(res).to.have.status(200);
              expect(res.body.success).to.equals(true);
              expect(res.body.events).to.have.lengthOf(2);
              done();

            });
        });

      });
    });
  });


  describe('/POST addEvent', () => {
    it('should create new event', (done) => {

      var event = EventTestHelpers.getValidEvent2();

      chai.request(server)
        .post('/events/addEvent')
        .set('Authorization', 'bearer ' + EventTestHelpers.Token)
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equals(true);
          expect(res.body.event.start).to.equals("2019-07-16T23:24:47.331Z");
          expect(res.body.event.end).to.equals("2019-07-16T23:26:26.334Z");
          expect(res.body.event.title).to.equals("This is a title");
          expect(res.body.event.details).to.equals("details");
          expect(res.body.event.location.address).to.equals("EC4V 5AF");
          expect(res.body.event.location.lngLat.coordinates[0]).to.equals(12);
          expect(res.body.event.location.lngLat.coordinates[1]).to.equals(12);
          done();
        });
    });

    it('should not create new event because address is not a string', (done) => {

      var event = EventTestHelpers.getInValidEvent();

      chai.request(server)
        .post('/events/addEvent')
        .set('Authorization', 'bearer ' + EventTestHelpers.Token)
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.errors).to.have.lengthOf(1);
          done();
        });
    });

    it('should return error as event already exist', (done) => {

      var event1 = EventTestHelpers.getValidEvent1();
      var event2 = EventTestHelpers.getValidEvent2();

      var offest = new Date().getTimezoneOffset() * 60 * 1000;
      event1.start = new Date(event1.start) - new Date(event1.start).getMinutes() * 1000 - offest
      event1.end = new Date(event1.end) - new Date(event1.end).getMinutes() * 1000 - offest;


      Event.create(event1, (err, event) => {
        chai.request(server)
          .post('/events/addEvent')
          .set('Authorization', 'bearer ' + EventTestHelpers.Token)
          .send(event2)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body.success).to.equals(false);
            done();
          });
      });
    });

  });

  describe('/Get getEventsForUser', () => {
    it('it should return events of specific user', (done) => {

      var event1 = EventTestHelpers.getValidEvent1();
      var event2 = EventTestHelpers.getValidEvent2();
      event2.ownerId = "11111";

      Event.create(event1, (err, event) => {

        Event.create(event2, (err, event) => {

          chai.request(server)
            .get('/events/getEventsForUser')
            .set('Authorization', 'bearer ' + EventTestHelpers.Token)
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

});
