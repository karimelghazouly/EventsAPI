## Please read the email I sent with the attached config files

## Overview
Since I added extra folder and files I will talk first about the folder structure

./controllers
This has the controllers where the main logic and fetching data exists

./models
This has the database schemas and connection

./routes
This contains routes in which every url connect to a controller

Till now nothing new.

./config
This has configeration files that has the secret data for dev and test, as I created two different DB for test and dev and i can specify which one to connect to by the config files.

./test
    /Integeration Tests
        This contains the integeration tests that I wrote
    /UnitTests
        This contains the unit ests that I wrote
    /TestHelpersfunctions
        This contains helpers functions for both unit tests and integrations for cleaner code
    mocha.opts
        This is just an options file for mocha i gave it an option to check the whole directory

./validator
    This contains the validation middleware I wrote for Event and User controllers.
    Also this contains the Error checker which checks for error and send a proper response, I add this here to avoid code duplication in different controllers.

Now I will talk about each part seperately

## Models

I Add a connetion to Mlab DB in seperate file in the Initconnection.js file
so we can have only one connection instance all across the app

Event Schema
    1 - Add another schema for points in GeoJSON format so we can benefit from this in the future for Geographical queris
    
    2 - Add this line  " Event = mongoose.model('Event', EventSchema) " so mongoose compiles a model for me so I can use it

    3 - Add assoication between User and event but adding ownerId field in the schema

User Schema
    1 - Make basic schema for user 

    2 - Add association between User and Events by the the events field in the schema
    this is needed so we can retrieve all the events of a user faster



## Controllers

Event Controller
    1 - Fix basic erros such as using undeclared variables, wrong syntax for query, wrong function names,  ..etc

    2 - Save every event by the hours only and ignore the minutes, seconds and miliseconds
        so we can know if there is events happen in the same time or not.

    3 - Replace this query condition 

        [{ start: { $gte: data.start } }, { end: { $lte: data.end } }],

        by this one
        {
        'start': data.start ,
        'end': data.end
        },

        because when the gte and lte operaters are used that will cause conflict between overlapping event

        Example
        ------------------------------------------ TimeLine
                AAAAAAAAAAAAAAA
                    BBBBB
        A is event
        B is different event
        but they will be considered the same


    4 - Add validation middleware before routing events to make sure that data came in the correct format and to give who ever is consuming the API a descriptive message to know what is wrong

    5 - I used JWT tokens for security and to handle users logging and registering, so before adding or viewing any events a user must be logged in, I check this by a middleware function


User Controller
    1 - Added these function Add user functionality, Login, Authenticate Token

    2 - Authenticate Token is the middleware responsible for checking if token is valid

    3 - I check before creating user if this email or user name was already registered before or not 

    4 - Added validation for the user data to make sure that data came in the correct format and to give who ever is consuming the API a descriptive message to know what is wrong

    5 - I encrypt the password before adding it in the databse using bcrypt for security 

    6 - I generate JWT tokens in succesful login and register and send them in the responce these are created by JWT and the secret is saved in the config file

    7 - The JWT secret is generated bascially by picking random 64 bytes in hexa decimal format

    7 - In login I check the password using bcrypt

    8 - For get all users and their events I use populate which is a feature in mongoose that gets the value of associated models


## Validators
I used express-validator for validation as it keeps everything nice and clean
Here we have 2 validators, these declare the rules in which the input should be following and check if this exists in the coming request or not after that the result of the check is called in the controller itself and is implmented in ErrorChecker.js

I used body() here because I check the body variables in the request.


## Tests
I used mochaa and chai for testing and i used nyc for code coverage.
in the user test I added this piece of code

beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });


this is because I have a different DB for testing I clear it then I put the needed data for test
I used the same style in all the tests.

I made seperate folder for helpers this is where all the hardcoded data come from to make code clean and avoid duplication.




## Running

Simply you can download the config files and run
npm start ==> this sets the env to dev and start the server
or 
npm test ==> this sets the env to test and run tests then the code coverage
    
      




Code coverage results

File                   |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------|----------|----------|----------|----------|-------------------|
All files              |    88.19 |    80.77 |    77.27 |     88.1 |                   |
 code-test             |      100 |      100 |      100 |      100 |                   |
  index.js             |      100 |      100 |      100 |      100 |                   |
 code-test/controllers |    79.17 |    77.27 |    73.68 |    79.17 |                   |
  EventController.js   |    77.42 |    83.33 |       70 |    77.42 |... 57,71,72,87,88 |
  UserController.js    |    80.49 |       75 |    77.78 |    80.49 |... 8,74,81,82,120 |
 code-test/models      |      100 |      100 |      100 |      100 |                   |
  Events.js            |      100 |      100 |      100 |      100 |                   |
  InitConnection.js    |      100 |      100 |      100 |      100 |                   |
  User.js              |      100 |      100 |      100 |      100 |                   |
 code-test/routes      |      100 |      100 |      100 |      100 |                   |
  EventsRoutes.js      |      100 |      100 |      100 |      100 |                   |
  UsersRoutes.js       |      100 |      100 |      100 |      100 |                   |
 code-test/validator   |      100 |      100 |      100 |      100 |                   |
  ErrorChecker.js      |      100 |      100 |      100 |      100 |                   |
  EventValidator.js    |      100 |      100 |      100 |      100 |                   |
-----------------------|----------|----------|----------|----------|-------------------|
