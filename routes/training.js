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

post:
  /save(body: name, location, date, description, teamid, weather) - Saves new training, sends error if occures
  /delete(body: id) - Delete the training from db, sends error if occures
*/

router.get("/data", function(req, res){

    var id = req.query.id;

    clientDB.getTraining(id, function(err, training) {
        if(err) {
            console.log(err);
            res.status(500).send(null);
        } else {
            res.send(training);
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

    clientDB.client.query("INSERT INTO public.training(name, location, date, description, teamid, temperature, weather) values($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, location, date, description, teamid, temperature, weather])
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