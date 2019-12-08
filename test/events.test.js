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
  describe('/GET Events', () => {
      it('it should GET all the events', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body.success).to.equals(true);
              done();
            });
      });
  });
});