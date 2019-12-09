process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Event = require('../models/Events');


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const { expect } = chai;


chai.use(chaiHttp);
//Our parent block
describe('Events', () => {

  beforeEach((done) => { //Before each test we empty the database
    Event.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/GET Events', () => {
    it('it should GET all the events', (done) => {

      let event1 = {
        "start": 123,
        "end": 33,
        "title": "christmas festival",
        "details": " event",
        "location": {
          "address": "somewhere",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 12]
          }
        }
      }

      let event2 = {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": " details",
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
          .get('/')
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

      let event = {
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
      .post('/')
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

      let event = {
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
      .post('/')
      .send(event)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.errors).to.have.lengthOf(1);
        done();
      });
    });
  });






});
