
/*
  Author: Matej Kalc

  This is the server of the application

  Tha application runs with nodejs and expressjs. It connects to postgresql database on heroku.
  The app uses also express-session to store data, like current user information.
*/


//Required variables
var port = process.env.PORT || 8080;
var express = require('express');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var server = express();

// Setup engine to work with html
server.set('views', __dirname + "/public/views");
server.set('view engine', 'ejs');
server.engine('html', require('ejs').renderFile);


//Setup database postgresql
var connectionString = "postgres://xfkviimebiiwqv:b6b8dc1935a7f3b587ea7d765f1f1b34f645b1d5ac026603ba6ab83810cebe3a@ec2-54-247-170-5.eu-west-1.compute.amazonaws.com:5432/db4qos1c3qoao0";
let pg = require('pg');
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}

let connString = process.env.DATABASE_URL || connectionString;
const { Client } = require('pg');

//Create pool (with ssl) to connect to client 

const client = new Client({
  connectionString : connString,
  ssl: true,
  dialect: 'postgres',
  dialectOptions: {
    "ssl": {"require":true }
  }
});

client.connect();

//App uses body parser to better read data in req.body
server.use(bodyParser.json());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

//App uses expressSession to store session data
server.use(
  expressSession({
    secret: '1234567890QWERTY', // Skrivni kljuÄ za podpisovanje piÅ¡kotkov
    saveUninitialized: true,    // Novo sejo shranimo
    resave: false,              // Ne zahtevamo ponovnega shranjevanja
    cookie: {
      maxAge: 3600000           // Seja poteÄe po 60 min neaktivnosti
    }
  })
);

//We are in the /public directory
server.use(express.static(__dirname + "/public"));

//Listen on port process.env.PORT || 8080
server.listen(port, function() {
  console.log("Server is working!");
});

server.get("/", function(req, res) {
  res.render("index");
});
server.get("/registration", function(req, res) {
  res.render("registration");
});
server.get("/login", function(req, res) {
  res.render("login");
});
server.get("/index", function(req, res) {
  res.render("index");
});
server.get("/home", function(req, res) {
  res.render("home");
});
server.get("/teams", function(req, res) {
  res.render("teams");
});
server.get("/team", function(req, res) {
  var teamid = req.param("teamid");
  res.render("team", {teamid: teamid});
});
server.get("/account", function(req, res) {
  res.render("account");
});

/*
  /user
get:
  /user/data - Sends user in session data
  /user/teams - Sends all teams data of user in session
  /user/trainings - Sends all trainings data of all teams of user in session
  /user/logout - Destroys session

post:
  /user/register(body: firstname, lastname, email, password) - Saves user, sends error if occures
  /user/login(body: email, password)- Checks user if in db, sends error if occures

*/
server.get("/user/data", function(req, res) {
  res.send(req.session.user);
});


server.get("/user/teams", function(req, res) {
  var user = req.session.user;

  getTeamsOfUser(user.id, function(err, teams) {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(teams);
    }
  });
});

server.get("/user/trainings", function(req, res) {
  var userid = req.session.user.id;
  var trainings = [];
  getTeamsOfUser(userid, function(err, teams) {
    if(err) {
      res.status(500).send(null);
    }
    var count = teams.length;
    teams.forEach(team => {
      getTrainingsOfTeam(team.id, function(err, trainingsOfTeam) {
        if(err) {
          res.status(500).send(null);
        }
        trainingsOfTeam.forEach( tr => {
          trainings.push(tr);
        });
        count -= 1;
        if(count == 0) {
          res.send(trainings);
        }
      }); 
    });

  });
});

server.get("/user/logout", function(req, res){
    req.session.destroy(function(err){
      if(err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
});

server.post("/user/register", function(req, res){
    var username = req.body.username;
    var usersurname = req.body.usersurname;
    var email = req.body.email;
    var password = req.body.password;

    client.query("SELECT * FROM public.user WHERE email = $1", [email]).then(res2 => {
      if(res2.rowsCount == 0) {

        client.query("INSERT INTO public.user(firstname, lastname, email, password) values($1, $2, $3, $4) RETURNING *", [username, usersurname, email, password])
        .then(res3 => {
            req.session.user = res3.rows[0];
            res.send(null);
          })
        .catch(e => {
          console.log(e.stack);
          res.send("Error: " + e);
        });

      } else {
        res.send("User already exists");
      }
    }).catch(e => {
      console.log(e.stack);
      res.send("Error: " + e);
    });
      
});

server.post("/user/login", function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  client.query("SELECT * FROM public.user WHERE email = $1 AND password = $2", [email, password])
  .then(res2 => {
    if(res2.rows.length > 0) {
      req.session.user = res2.rows[0];
      res.send(null);
    } else {
      res.send("Error: User with this passwrd does not exist.");
    }
    })
  .catch(e => {
    console.log(e.stack);
    res.sendStatus(500);
  });
});


/*
  /team

get:
  /team/data(body: id) - Sends data of a specific team
  /team/trainings(body: teamid) - Sends all trainings for a specific team

post:
  /team/save(body: name, numberOfRacers, userid) - Saves new team, sends error if occures
  /team/delete(body: id) - Delete the team from db, sends error if occures
*/

server.get("/team/data", function(req, res){

  var id = req.query.id;

  getTeam(id, function(err, team) {
    if(err) {
      console.log(err);
      res.status(500).send(null);
    } else {
      res.send(team);
    }
  });
});

server.get("/team/trainings", function(req, res){

  var id = req.query.id;

  getTrainingsOfTeam(id, function(err, trainings) {
    if(err) {
      console.log(err);
      res.status(500).send(null);
    } else {
      res.send(trainings);
    }
  });
});

server.post("/team/save", function(req, res){
  var name = req.body.name;
  var numberOfRacers = req.body.numberOfRacers;
  var trainerid = req.body.userid;

  client.query("INSERT INTO public.team(name, userid, numberofracers) values($1, $2, $3) RETURNING *", [name, trainerid, numberOfRacers])
  .then(() => {
      res.send(null);
    })
  .catch(e => {
    console.log(e.stack);
    res.sendStatus(500);
  });
});

server.post("/team/delete", function(req, res){
  var id = req.body.id;

  client.query("DELETE FROM public.team WHERE id = $1", [id])
  .then(() => {
      res.send(null);
    })
  .catch(e => {
    console.log(e.stack);
    res.sendStatus(500);
  });
});


/*
  /training

get:
  /training/data(body: id) - Sends data of a specific training

post:
  /training/save(body: name, location, date, description, teamid, weather) - Saves new training, sends error if occures
  /training/delete(body: id) - Delete the training from db, sends error if occures
*/

server.get("/training/data", function(req, res){

  var id = req.query.id;

  getTraining(id, function(err, training) {
    if(err) {
      console.log(err);
      res.status(500).send(null);
    } else {
      res.send(training);
    }
  });
});

server.post("/training/save", function(req, res){
  var name = req.body.name;
  var location = req.body.location;
  var date = req.body.date;
  var description = req.body.description;
  var teamid = req.body.teamid;

  client.query("INSERT INTO public.training(name, location, date, description, teamid) values($1, $2, $3, $4, $5) RETURNING *", [name, location, date, description, teamid])
  .then(() => {
      res.send(null);
    })
  .catch(e => {
    console.log(e.stack);
    res.sendStatus(500);
  });
});

server.post("/training/delete", function(req, res){
  var id = req.body.id;

  client.query("DELETE FROM public.training WHERE id = $1", [id])
  .then(() => {
      res.send(null);
    })
  .catch(e => {
    console.log(e.stack);
    res.sendStatus(500);
  });
});


/*

  Various functions

*/

//This function callbacks all teams of a specific user
function getTeamsOfUser(userID, callback) {
  
  client.query("SELECT * FROM public.team WHERE userid = $1", [userID])
  .then(res2 => {
    callback(null, res2.rows);
    })
  .catch(e => {
    callback(e, null);
  });

}

//This function callbacks team data
function getTeam(teamid, callback) {
  
  client.query("SELECT * FROM public.team WHERE id = $1", [teamid])
  .then(res2 => {
    callback(null, res2.rows[0]);
    })
  .catch(e => {
    callback(e, null);
  });
}

//This function callbacks all trainings of a specific team
function getTrainingsOfTeam(teamID, callback) {
  
  client.query("SELECT * FROM public.training WHERE teamid = $1", [teamID])
  .then(res2 => {
    callback(null, res2.rows);
    })
  .catch(e => {
    callback(e, null);
  });
}

function getTraining(id, callback) {
  
  client.query("SELECT * FROM public.training WHERE id = $1", [id])
  .then(res2 => {
    callback(null, res2.rows[0]);
    })
  .catch(e => {
    callback(e, null);
  });
}


module.exports = server;