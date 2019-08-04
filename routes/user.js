var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/*
  /user
get:
  /data - Sends user in session data
  /teams - Sends all teams data of user in session
  /trainings - Sends all trainings data of all teams of user in session
  /logout - Destroys session

post:
  /register(body: firstname, lastname, email, password) - Saves user, sends error if occures
  /login(body: email, password)- Checks user if in db, sends error if occures

*/
router.get("/data", function(req, res) {
  res.send(req.session.user);
});


router.get("/teams", function(req, res) {
  var user = req.session.user;

  clientDB.getTeamsOfUser(user.id, req.session.user.id, function(err, teams) {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(teams);
    }
  });
});

router.get("/trainings", function(req, res) {
  var userid = req.session.user.id;
  var trainings = [];
  clientDB.getTeamsOfUser(userid, req.session.user.id, function(err, teams) {
    if(err) {
      console.log(err);
      res.status(500).send(null);
    } else {
      var count = teams.length;
      teams.forEach(team => {
        clientDB.getTrainingsOfTeam(team.id, req.session.user.id, function(err, trainingsOfTeam) {
          if(err) {
            res.status(500).send(null);
          } else {
            trainingsOfTeam.forEach( tr => {
              trainings.push(tr);
            });
            count -= 1;
            if(count == 0) {
              res.send(trainings);
            }
        }
        });
      });
    }
  });
});

router.get("/races", function(req, res) {
  var userid = req.session.user.id;
  var races = [];
  clientDB.getTeamsOfUser(userid, req.session.user.id, function(err, teams) {
    if(err) {
      console.log(err);
      res.status(500).send(null);
    } else {
      var count = teams.length;
      teams.forEach(team => {
        clientDB.getRacesOfTeam(team.id, function(err, racesOfTeam) {
          if(err) {
            res.status(500).send(null);
          } else {
            racesOfTeam.forEach( tr => {
              races.push(tr);
            });
            count -= 1;
            if(count == 0) {
              res.send(races);
            }
          }
        }); 
      });
    }
  });
});
  
  router.get("/logout", function(req, res){
      req.session.destroy(function(err){
        if(err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
  });
  
router.post("/register", function(req, res){
    var username = req.body.username;
    var usersurname = req.body.usersurname;
    var email = req.body.email;
    var password = req.body.password;

    if(!isPasswordValid(password) || !isEmailValid(email)) {
      res.send("Password or email not valid");
      res.end();
      return;
    }

    clientDB.client.query("SELECT * FROM public.user WHERE email = $1", [email]).then(res2 => {
      if(res2.rowsCount == 0) {

      clientDB.client.query("INSERT INTO public.user(firstname, lastname, email, password) values($1, $2, $3, $4) RETURNING *", [username, usersurname, email, password])
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
  
router.post("/login", function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  if(!isPasswordValid(password) || !isEmailValid(email)) {
    res.send("Password or email not valid");
    res.end();
    return;
  }

  clientDB.client.query("SELECT * FROM public.user WHERE email = $1 AND password = $2", [email, password])
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

//This function checks if the password is in a valid format
function isPasswordValid(password) {
  if(password.length >= 8 && password.length <= 20) {
      return true;
  }
  return false;
}

//This function checks if the email is in a valid format
function isEmailValid(email) {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
}

module.exports = router;