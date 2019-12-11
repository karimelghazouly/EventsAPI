 
const Config = require('config');
const JWT = require("jsonwebtoken");
var token = Config.get("Test_Token");
let user_data = JWT.verify(token, Config.get('TOKEN_SECRET'));

function getValidEvent1(){

    return {
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

}


function getValidEvent2(){

    return {
        "start": 1563312312331,
        "end": 1563312412334,
        "title": "This is a title",
        "details": "details",
        "ownerId": user_data._id,
        "location": {
          "address": "EC4V 5AF",
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 12]
          }
        }
      };
}


function getInValidEvent(){

    return {
        "start": 123,
        "end": 33,
        "title": "This is a title",
        "details": "details",
        "ownerId": user_data._id,
        "location": {
          "address": 122,
          "lngLat": {
            "type": "Point",
            "coordinates": [12, 123]
          }
        }
      };
}


module.exports = {
    "Token": token,
    "getValidEvent1": getValidEvent1,
    "getValidEvent2": getValidEvent2,
    "getInValidEvent": getInValidEvent
}