
/*
  Author: Matej Kalc

  This is the app of the application

  Tha application runs with nodejs and expressjs. It connects to postgresql database on heroku.
  The app uses also express-session to store data, like current user information.
*/


//Required variables
var port = process.env.PORT || 8080;
var express = require('express');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

//Setup routing
var indexRouter =  require('./routes/index');
var loginRouter =  require('./routes/login');
var accountRouter =  require('./routes/account');
var registrationRouter =  require('./routes/registration');
var homeRouter =  require('./routes/home');
var teamRouter =  require('./routes/team');
var teamsRouter =  require('./routes/teams');
var trainingRouter =  require('./routes/training');
var userRouter =  require('./routes/user');
var racerRouter =  require('./routes/racer');
var mistakeRouter =  require('./routes/mistake');
var raceRouter =  require('./routes/race');
var raceApperanceRouter =  require('./routes/raceApperance');
var trainingApperanceRouter =  require('./routes/trainingApperance');

//App uses expressSession to store session data
app.use(
  expressSession({
    secret: '1234567890QWERTY', // Skrivni kljuÄ za podpisovanje piÅ¡kotkov
    saveUninitialized: true,    // Novo sejo shranimo
    resave: false,              // Ne zahtevamo ponovnega shranjevanja
    cookie: {
      maxAge: 3600000           // Seja poteÄe po 60 min neaktivnosti
    }
  })
);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use('/account', accountRouter);
app.use('/home', homeRouter);
app.use('/team', teamRouter);
app.use('/teams', teamsRouter);
app.use('/training', trainingRouter);
app.use('/user', userRouter);
app.use('/racer', racerRouter);
app.use('/mistake', mistakeRouter);
app.use('/race', raceRouter);
app.use('/raceApperance', raceApperanceRouter);
app.use('/trainingApperance', trainingApperanceRouter);


module.exports = app;