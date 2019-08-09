var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/*
  /mistake
get:
  /data(body: id) - Sends racer data

post:
  /save(body: firstname, lastname, gender, birth, description, teamid) - Saves racer, sends error if occures
  /delete(body: id) - Deletes racer, if exists
  /update(body)
*/

router.get("/data", function(req, res) {
    var id = req.query.id;

    clientDB.getMistake(id, req.session.user.id, function(err, mistake){
        if(err) {
            alert(err);
            res.sendStatus(500);
        } else {
            res.send(mistake);
        }
    });
});

router.post("/save", function(req, res) {
    var name = req.body.name;
    var creationdate = req.body.creationdate;
    var racerid = req.body.racerid;

    clientDB.client.query("INSERT INTO public.mistake(name, creationdate, racerid, createdby) values($1, $2, $3, $4)", [name, creationdate, racerid, req.session.user.id])
    .then(res2 => {
        res.end();
    })
    .catch(e => {
        res.send(e);
    });
});

router.post("/delete", function(req, res){
    var id = req.body.id;

    clientDB.client.query("DELETE FROM public.mistake WHERE id = $1", [id])
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
    var creationdate = req.body.creationdate ? req.body.creationdate : null;
    var endDate = req.body.endDate ? req.body.endDate : null;

    clientDB.client.query("UPDATE public.mistake SET name = $1, creationdate = $2, enddate = $3 WHERE id = $4", [name, creationdate, endDate, id])
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});
router.post("/addEndDate", function(req, res){
    var id = req.body.id;
    var endDate = req.body.endDate;
    
    clientDB.client.query("UPDATE public.mistake SET enddate = '" + endDate + "' WHERE id = '" + id + "'")
    .then(() => {
        res.send(null);
        })
    .catch(e => {
        console.log(e.stack);
        res.sendStatus(500);
    });
});



module.exports = router;