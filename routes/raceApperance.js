var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/*
  /raceApperance
get:
  /data(body: id) - Sends raceApperance data

post:
  /save(body: raceid, racerid, placement, placementType) - Saves raceApperance, sends error if occures
  /delete(body: id) - Deletes raceApperance, if exists
*/

router.get("/data", function(req, res) {
    var id = req.query.id;

    clientDB.getRaceApperance(id, req.session.user.id, function(err, racer){
        if(err) {
            alert(err);
            res.sendStatus(500);
        } else {
            res.send(racer);
        }
    });
});

router.post("/save", function(req, res) {
    var raceid = req.body.raceid;
    var racerid = req.body.racerid;
    var placement = req.body.placement;
    var placementType = req.body.placementType;
    console.log(1);

    clientDB.client.query("INSERT INTO public.raceapperance(raceid, racerid, placement, \
        placementType, createdby) values($1, $2, $3, $4, $5)", [raceid, racerid, placement,
            placementType, req.session.user.id])
    .then(res2 => {
        console.log(2);
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

    clientDB.client.query("DELETE FROM public.raceapperance WHERE id = $1", [id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});



module.exports = router;