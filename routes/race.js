var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/* GET account page. */
router.get('/', function(req, res, next) {
  res.render('race');
});


/*
  /race

get:
  /data(body: id) - Sends data of a specific race
  /apperances(body: id) - Sends data of apperances of a specific race

post:
  /save(body: name, location, date, description, teamid, weather) - Saves new race, sends error if occures
  /delete(body: id) - Delete the race from db, sends error if occures
*/

router.get("/data", function(req, res){

    var id = req.query.id;

    clientDB.getRace(id, req.session.user.id, function(err, race) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(race);
        }
    });
});

router.get("/apperances", function(req, res){

    var id = req.query.id;

    clientDB.getApperancesOfRace(id, req.session.user.id, function(err, apperances) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(apperances);
        }
    });
});

router.post("/save", function(req, res){
    var name = req.body.name;
    var location = req.body.location;
    var date = req.body.date;
    var description = req.body.description;
    var teamid = req.body.teamid;
    var weather = req.body.weather;
    var temperature = req.body.temperature;
    var discipline = req.body.discipline;
    var numberOfSkiGates = req.body.numberOfSkiGates;

    clientDB.client.query("INSERT INTO public.race(name, location, date, \
        description, teamid, temperature, weather, discipline, \
        numberofskigates, createdby) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [name,
             location, date, description, teamid, temperature, weather, discipline, numberOfSkiGates, req.session.user.id])
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
    var location = req.body.location;
    var date = req.body.date;
    var description = req.body.description;
    var teamid = req.body.teamid;
    var weather = req.body.weather;
    var temperature = req.body.temperature;
    var discipline = req.body.discipline;
    var numberOfSkiGates = req.body.numberOfSkiGates;

    clientDB.client.query("UPDATE public.race SET name=$1, location=$2, date=$3, description=$4, teamid=$5, temperature=$6, weather=$7, discipline=$8, \
        numberofskigates=$9 WHERE id=$10", [name, location, date, description, teamid, temperature, weather, discipline, numberOfSkiGates, id])
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

    clientDB.client.query("DELETE FROM public.race WHERE id = $1", [id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});

module.exports = router;