
const Config = require('config');
const Bcrypt = require('bcrypt');

var token = Config.get("Test_Token");

function getTestUser1(){
    return {
        "username": "testuser",
        "password": "112233",
        "email": "test@gmail.com",
        "age": 12
    };
}

function getTestUser2()
{
    return {
        "username": "testuser2",
        "password": "112233",
        "email": "test2@gmail.com",
        "age": 13
    };
}

function getEncryptedTestUser1(){
    var user = getTestUser1();
    user.password = Bcrypt.hashSync(user_data.password, 10);
    return user;
}


function getEncryptedTestUser2(){
    var user = getTestUser2();
    user.password = Bcrypt.hashSync(user_data.password, 10);
    return user;
}


module.exports = {
    "getTestUser1" : getTestUser1,
    "getTestUser2" : getTestUser2,
    "getEncryptedTestUser1": getEncryptedTestUser1,
    "getEncryptedTestUser2": getEncryptedTestUser2,
    "Token":token
}

