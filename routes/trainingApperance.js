var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/*
  /trainingApperance
get:
  /data(body: id) - Sends trainingApperance data

post:
  /save(body: trainingid, racerid) - Saves trainingApperance, sends error if occures
  /delete(body: id) - Deletes trainingApperance, if exists
*/

router.get("/data", function(req, res) {
    var id = req.query.id;

    clientDB.getTrainingApperance(id, req.session.user.id, function(err, racer){
        if(err) {
            alert(err);
            res.sendStatus(500);
        } else {
            res.send(racer);
        }
    });
});

router.post("/save", function(req, res) {
    var trainingid = req.body.trainingid;
    var racerid = req.body.racerid;

    clientDB.client.query("INSERT INTO public.trainingapperance(trainingid, racerid, createdby) values($1, $2, $3)", [trainingid, racerid, req.session.user.id])
    .then(res2 => {
        res.send(null);
        res.end();
    })
    .catch(e => {
        console.log();
        res.send(e);
    });
});

router.post("/delete", function(req, res){
    var id = req.body.id;

    clientDB.client.query("DELETE FROM public.trainingapperance WHERE id = $1", [id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});



module.exports = router;