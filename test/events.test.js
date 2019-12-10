process.env.NODE_ENV = 'test';

var server = require('../index');
var Event = require('../models/Events');
var User = require('../models/User');
var chai = require('chai');
var chaiHttp = require('chai-http');
const { expect } = chai;
const Config = require('config');
const JWT = require("jsonwebtoken");


chai.use(chaiHttp);
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudHMiOltdLCJfaWQiOiI1ZGVmOWExM2Q2NmU1YzNlMDUyNGFhYzciLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicGFzc3dvcmQiOiIkMmIkMTAkMGJVZWhZWmc4T015SUs2b1lNby5QLjNsaTk2a3dKY2pKc01rejJIeFNFRjMuR3ljaUdxa2EiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiYWdlIjoxMiwiX192IjowLCJpYXQiOjE1NzU5ODM2MzV9.oRUg5ry8HHQRbU1h23Qidfp-ze0kKWH1VNbTfCEHBH8";
describe('Events', () => {

  beforeEach((done) => {
    Event.deleteMany({}, (err) => {
      User.deleteMany({}, (err) => {
        user_data =
          {
            "username": "testuser",
            "password": "112233",
            "email": "test@gmail.com",
            "age": 12
          };

        User.create(user_data);
        done();
      });
    });
  });

  describe('/GET Events', () => {
    it('it should GET all the events', (done) => {
      let user_data = JWT.verify(token, Config.get('TOKEN_SECRET'));

      var event1 = {
        "start": 123,
        "end": 33,
        "title": "christmas festival",
        "details": " event",
        "ownerId": user_data._id,
        "location": {
          "address": "somewhere",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 12]
          }
        }
      }

      var event2 = {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": " details",
        "ownerId": user_data._id,
        "location": {
          "address": "EC4V 5AF",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 123]
          }
        }
      }

      Event.create(event1, (err, event) => {

        Event.create(event2, (err, event) => {

          chai.request(server)
            .get('/events/getEvents')
            .set('Authorization', 'bearer ' + token)
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


  describe('/POST Events', () => {
    it('it should create new event', (done) => {

      var event = {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": "details",
        "location": {
          "address": "EC4V 5AF",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 123]
          }
        }
      }

      chai.request(server)
        .post('/events/addEvent')
        .set('Authorization', 'bearer ' + token)
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equals(true);
          expect(res.body.event.start).to.equals("1970-01-01T02:00:00.123Z");
          expect(res.body.event.end).to.equals("1970-01-01T02:00:00.033Z");
          expect(res.body.event.title).to.equals("This is a title");
          expect(res.body.event.details).to.equals("details");
          expect(res.body.event.location.address).to.equals("EC4V 5AF");
          expect(res.body.event.location.lngLat.coordinates[0]).to.equals(12);
          expect(res.body.event.location.lngLat.coordinates[1]).to.equals(123);
          done();
        });
    });
  });

  describe('/POST Events With Invalid Input', () => {
    it('it should not create new event', (done) => {

      var event = {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": "details",
        "location": {
          "address": 33,
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 123]
          }
        }
      }

      chai.request(server)
        .post('/events/addEvent')
        .set('Authorization', 'bearer ' + token)
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.errors).to.have.lengthOf(1);
          done();
        });
    });
  });

  describe('/POST Events With Invalid Input', () => {
    it('it should not create new event', (done) => {

      var event = {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": "details",
        "location": {
          "address": 33,
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 123]
          }
        }
      };

      chai.request(server)
        .post('/events/addEvent')
        .set('Authorization', 'bearer ' + token)
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.errors).to.have.lengthOf(1);
          done();
        });
    });
  });

  describe('/Get Events For Specific User', () => {
    it('it should return events of specific user', (done) => {

      let user_data = JWT.verify(token, Config.get('TOKEN_SECRET'));

      var event1 = {
        "start": 123,
        "end": 33,
        "title": "christmas festival",
        "details": " event",
        "ownerId": user_data._id,
        "location": {
          "address": "somewhere",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 12]
          }
        }
      };

      var event2 = {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": " details",
        "ownerId": "123123123",
        "location": {
          "address": "EC4V 5AF",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 123]
          }
        }
      };

      Event.create(event1, (err, event) => {

        Event.create(event2, (err, event) => {

          chai.request(server)
            .get('/events/getEventsForUser')
            .set('Authorization', 'bearer ' + token)
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


  describe('/Post Make Duplicate Events', () => {
    it('it should return error as event already exist', (done) => {

      let user_data = JWT.verify(token, Config.get('TOKEN_SECRET'));

      var event1 = {
        "start": 1563312312331,
        "end": 1563312412334,
        "title": "christmas festival",
        "details": "event",
        "ownerId": user_data._id,
        "location": {
          "address": "somewhere",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 12]
          }
        }
      };

      var offest = new Date().getTimezoneOffset() * 60 * 1000;
      event1.start = new Date(event1.start) - new Date(event1.start).getMinutes() * 1000 - offest
      event1.end = new Date(event1.end) - new Date(event1.end).getMinutes() * 1000 - offest;
      

      var event2 = {
        "start": 1563312312331,
        "end": 1563312412334,
        "title": "christmas festival",
        "details": "event",
        "ownerId": user_data._id,
        "location": {
          "address": "somewhere",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 12]
          }
        }
      };

      Event.create(event1, (err, event) => {
          chai.request(server)
          .post('/events/addEvent')
          .set('Authorization', 'bearer ' + token)
          .send(event2)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body.success).to.equals(false);
            done();
          });
      });
    });
  });



});
