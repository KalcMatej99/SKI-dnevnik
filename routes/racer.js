var express = require('express');
var clientDB = require('../public/javascripts/clientDB');
var router = express.Router();

/*
  /racer
get:
  /data(body: id) - Sends racer data

post:
  /save(body: firstname, lastname, gender, birth, description, teamid) - Saves racer, sends error if occures
  /delete(body: id) - Deletes racer, if exists
*/

router.get("/data", function(req, res) {
    var id = req.query.id;

    clientDB.getRacer(id, function(err, racer){
        if(err) {
            alert(err);
            res.sendStatus(500);
        } else {
            res.send(racer);
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
         description, teamid, birth) values($1, $2, $3, $4, $5, $6)", [firstname, lastname, gender,
        description, teamid, birth])
    .then(res2 => {
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