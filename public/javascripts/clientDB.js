module.exports = {};

//Setup database postgresql
var connectionString = "postgres://xfkviimebiiwqv:b6b8dc1935a7f3b587ea7d765f1f1b34f645b1d5ac026603ba6ab83810cebe3a@ec2-54-247-170-5.eu-west-1.compute.amazonaws.com:5432/db4qos1c3qoao0";
;
let pg = require('pg');
if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}

let connString = process.env.DATABASE_URL || connectionString;
const { Client } = require('pg');

//Create pool (with ssl) to connect to client 

const client = new Client({
  connectionString : connString,
  ssl: true,
  dialect: 'postgres',
  dialectOptions: {
    "ssl": {"require":true }
  }
});

client.connect();

module.exports.client = client;


/*

  Various functions

*/

//This function callbacks all teams of a specific user
module.exports.getTeamsOfUser = function(userID, callback) {
  
  client.query("SELECT * FROM public.team WHERE userid = $1", [userID])
  .then(res2 => {
    callback(null, res2.rows);
    })
  .catch(e => {
    callback(e, null);
  });
};

//This function callbacks team data
module.exports.getTeam = function(teamid, callback) {
  
  client.query("SELECT * FROM public.team WHERE id = $1", [teamid])
  .then(res2 => {
    callback(null, res2.rows[0]);
    })
  .catch(e => {
    callback(e, null);
  });
};

//This function callbacks all trainings of a specific team
module.exports.getTrainingsOfTeam = function(teamID, callback) {
  
  client.query("SELECT * FROM public.training WHERE teamid = $1", [teamID])
  .then(res2 => {
    callback(null, res2.rows);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getTraining = function(id, callback) {
  
  client.query("SELECT * FROM public.training WHERE id = $1", [id])
  .then(res2 => {
    callback(null, res2.rows[0]);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRacer = function(id, callback) {
  
  client.query("SELECT * FROM public.racer WHERE id = $1", [id])
  .then(res2 => {
    callback(null, res2.rows[0]);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getMistake = function(id, callback) {
  
  client.query("SELECT * FROM public.mistake WHERE id = $1", [id])
  .then(res2 => {
    callback(null, res2.rows[0]);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRacersOfTeam = function(id, callback) {
  client.query("SELECT * FROM public.racer WHERE teamid = $1", [id])
  .then(res2 => {
    callback(null, res2.rows);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getMistakesOfRacer = function(id, callback) {
  client.query("SELECT * FROM public.mistake WHERE racerid = $1", [id])
  .then(res2 => {
    callback(null, res2.rows);
    })
  .catch(e => {
    callback(e, null);
  });
};