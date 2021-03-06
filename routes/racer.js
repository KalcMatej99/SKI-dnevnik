var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/*
  /racer
get:
  /data(body: id) - Sends racer data
  /mistakes(body: id) - Sends all racers misatkes (open and closed)
  /trainings/apperances(body:id)
  /races/apperances(body:id)

post:
  /save(body: firstname, lastname, gender, birth, description, teamid) - Saves racer, sends error if occures
  /update(body: id, firstname, lastname, gender, birth, description, teamid) - Updates racer, sends error if occures
  /delete(body: id) - Deletes racer, if exists
*/

router.get("/data", function(req, res) {
    var id = req.query.id;

    clientDB.getRacer(id, req.session.user.id, function(err, racer){
        if(err) {
            alert(err);
            res.sendStatus(500);
        } else {
            res.send(racer);
        }
    });
});

router.get("/mistakes", function(req, res) {
    var id = req.query.id;

    clientDB.getMistakesOfRacer(id, req.session.user.id, function(err, mistakes){
        if(err) {
            alert(err);
            res.sendStatus(500);
        } else {
            res.send(mistakes);
        }
    });
});

router.get("/trainings/apperances", function(req, res){

    var id = req.query.id;

    clientDB.getTrainingApperancesOfRacer(id, req.session.user.id, function(err, apperances) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(apperances);
        }
    });
});

router.get("/races/apperances", function(req, res){

    var id = req.query.id;

    clientDB.getRaceApperancesOfRacer(id, req.session.user.id, function(err, apperances) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(apperances);
        }
    });
});

router.post("/save", function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var gender = req.body.gender;
    var description = req.body.description;
    var teamid = req.body.teamid;
    var birth = req.body.birth;

    clientDB.client.query("INSERT INTO public.racer(firstname, lastname, gender, \
         description, teamid, birth, createdby) values($1, $2, $3, $4, $5, $6, $7)", [firstname, lastname, gender,
        description, teamid, birth, req.session.user.id])
    .then(() => {
        res.end();
    })
    .catch(e => {
        res.send(e);
    });
});

router.post("/update", function(req, res) {
    var id = req.body.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var gender = req.body.gender;
    var description = req.body.description;
    var teamid = req.body.teamid;
    var birth = req.body.birth;

    clientDB.client.query("UPDATE public.racer SET firstname = $1, lastname=$2, gender=$3, description=$4, teamid=$5, birth=$6 WHERE id=$7", 
    [firstname, lastname, gender, description, teamid, birth, id])
    .then(() => {
        res.end();
    })
    .catch(e => {
        res.send(e);
    });
});

router.post("/delete", function(req, res){
    var id = req.body.id;

    clientDB.client.query("DELETE FROM public.racer WHERE id = $1", [id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});



module.exports = router;