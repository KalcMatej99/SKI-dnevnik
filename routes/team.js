var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('team');
});


/*
/team

get:
    /data(body: id) - Sends data of a specific team
    /trainings(body: teamid) - Sends all trainings for a specific team
    /racers(body: id) - Sends data of racers of team
    /races(body: id) - Sends data of races of team

post:
    /save(body: name, numberOfRacers, userid) - Saves new team, sends error if occures
    /delete(body: id) - Delete the team from db, sends error if occures
*/

router.get("/data", function(req, res){
    var id = req.query.id;

    clientDB.getTeam(id, req.session.user.id, function(err, team) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(team);
        }
    });
});

router.get("/trainings", function(req, res){

    var id = req.query.id;

    clientDB.getTrainingsOfTeam(id, req.session.user.id, function(err, trainings) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(trainings);
        }
    });
});

router.get("/racers", function(req, res){
    var id = req.query.id;

    clientDB.getRacersOfTeam(id, req.session.user.id, function(err, racers) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(racers);
        }
    });
});

router.get("/races", function(req, res){
    var id = req.query.id;

    clientDB.getRacesOfTeam(id, req.session.user.id, function(err, races) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(races);
        }
    });
});

router.post("/save", function(req, res){
    var name = req.body.name;
    var numberOfRacers = req.body.numberOfRacers;
    var trainerid = req.body.userid;

    clientDB.client.query("INSERT INTO public.team(name, userid, numberofracers, createdby) values($1, $2, $3, $4) RETURNING *", [name, trainerid, 
        numberOfRacers, req.session.user.id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});

router.post("/update", function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var userid = req.body.userid;

    clientDB.client.query("UPDATE public.team SET name=$1, userid=$2 WHERE id=$3", [name, userid, id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});

router.post("/delete", function(req, res){
    var id = req.body.id;

    clientDB.client.query("DELETE FROM public.team WHERE id = $1", [id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});

module.exports = router;