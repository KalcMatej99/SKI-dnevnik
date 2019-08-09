var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/* GET account page. */
router.get('/', function(req, res, next) {
  res.render('training');
});


/*
  /training

get:
  /data(body: id) - Sends data of a specific training
  /apperances(body: id) - Sends data of apperances of a specific training

post:
  /save(body: name, location, date, description, teamid, weather) - Saves new training, sends error if occures
  /delete(body: id) - Delete the training from db, sends error if occures
*/

router.get("/data", function(req, res){

    var id = req.query.id;

    clientDB.getTraining(id, req.session.user.id, function(err, training) {
        if(err) {
            console.log(err);
            res.send(null);
        } else {
            res.send(training);
        }
    });
});

router.get("/apperances", function(req, res){

    var id = req.query.id;

    clientDB.getApperancesOfTraining(id, req.session.user.id, function(err, apperances) {
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
    var type = req.body.type;
    var discipline = req.body.discipline;
    var numberOfTracks = req.body.numberOfTracks;
    var numberOfSkiGates = req.body.numberOfSkiGates;
    var isRacingTrack = req.body.isRacingTrack;
    var presenceOfTraining = req.body['presenceOfTraining[]'];
    var numberOfElementsInPresenceOfTraining = req.body.numberOfElementsInPresenceOfTraining;

    clientDB.client.query("INSERT INTO public.training(name, location, date, \
        description, teamid, temperature, weather, type, discipline, numberoftracks, \
        numberofskigates, isracingtrack, createdby) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *", [name,
             location, date, description, teamid, temperature, weather, type, discipline,
            numberOfTracks, numberOfSkiGates, isRacingTrack, req.session.user.id])
    .then(res2 => {

        var donePresences = 0;

        for(var i = 0; i < numberOfElementsInPresenceOfTraining; i++) {
            clientDB.client.query("INSERT INTO public.trainingapperance(racerid, trainingid, createdby) values($1, $2, $3) RETURNING *", [(numberOfElementsInPresenceOfTraining == 1) ? presenceOfTraining : presenceOfTraining[i],
                res2.rows[0].id, req.session.user.id])
            .then(res3 => {
                donePresences += 1;

                if(donePresences == numberOfElementsInPresenceOfTraining){
                    res.send(null);
                    res.end();   
                }
            }).catch(e => {
                console.log(e.stack);
                res.sendStatus(500);
            });
        }
    }).catch(e => {
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
    var type = req.body.type;
    var discipline = req.body.discipline;
    var numberOfTracks = req.body.numberOfTracks;
    var numberOfSkiGates = req.body.numberOfSkiGates;
    var isRacingTrack = req.body.isRacingTrack;

    console.log(req.body);

    clientDB.client.query("UPDATE public.training SET name=$1, location=$2, date=$3, description=$4, teamid=$5, temperature=$6, weather=$7, type=$8, \
        discipline=$9, numberoftracks=$10, numberofskigates=$11, isracingtrack=$12 WHERE id=$13", [name, location, date, description, teamid,
        temperature, weather, type, discipline, numberOfTracks, numberOfSkiGates, isRacingTrack, id])
    .then(() => {
        res.send(null);
        res.end();   
    }).catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

router.post("/delete", function(req, res){
    var id = req.body.id;

    clientDB.client.query("DELETE FROM public.training WHERE id = $1", [id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});

module.exports = router;