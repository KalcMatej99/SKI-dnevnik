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

function checkIfAccessToData(object, useridAccess) {
  return object.createdby == useridAccess;
}

//This function callbacks all teams of a specific user
module.exports.getTeamsOfUser = function(userID, useridAccess, callback) {
  
  client.query("SELECT * FROM public.team WHERE userid = $1", [userID])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    console.log(2);
    callback(e, null);
  });
};

//This function callbacks team data
module.exports.getTeam = function(teamid, useridAccess, callback) {
  if(teamid == null) {
    callback("Id is null", null);
    return;
  }
  
  client.query("SELECT * FROM public.team WHERE id = $1", [teamid])
  .then(res2 => {
    if(checkIfAccessToData(res2.rows[0], useridAccess)){
      callback(null, res2.rows[0]);
    } else {
      callback("No access to data", null);
    }
  })
  .catch(e => {
    callback(e, null);
  });
};

//This function callbacks all trainings of a specific team
module.exports.getTrainingsOfTeam = function(teamID, useridAccess, callback) {

  if(teamID == null) {
    callback("Id is null", null);
    return;
  }
  
  client.query("SELECT * FROM public.training WHERE teamid = $1", [teamID])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getTraining = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }
  
  client.query("SELECT * FROM public.training WHERE id = $1", [id])
  .then(res2 => {
    if(checkIfAccessToData(res2.rows[0], useridAccess)){
      callback(null, res2.rows[0]);
    } else {
      callback("No access to data", null);
    }
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRace = function(id, useridAccess, callback) {
  
  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.race WHERE id = $1", [id])
  .then(res2 => {
    if(checkIfAccessToData(res2.rows[0], useridAccess)){
      callback(null, res2.rows[0]);
    } else {
      callback("No access to data", null);
    }
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRacer = function(id, useridAccess, callback) {
  
  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.racer WHERE id = $1", [id])
  .then(res2 => {
    if(checkIfAccessToData(res2.rows[0], useridAccess)){
      callback(null, res2.rows[0]);
    } else {
      callback("No access to data", null);
    }
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getMistake = function(id, useridAccess, callback) {
  
  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.mistake WHERE id = $1", [id])
  .then(res2 => {
    if(checkIfAccessToData(res2.rows[0], useridAccess)){
      callback(null, res2.rows[0]);
    } else {
      callback("No access to data", null);
    }
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRacersOfTeam = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.racer WHERE teamid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRacesOfTeam = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.race WHERE teamid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    console.log(objects);
    if(objects.length == 0) {
      callback(null, []);
      return;
    }
    console.log(2);
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });

    console.log(3);
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    console.log(1);
    callback(e, null);
  });
};

module.exports.getMistakesOfRacer = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.mistake WHERE racerid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getApperancesOfTraining = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.trainingapperance WHERE trainingid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getApperancesOfRace = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.raceapperance WHERE raceid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getTrainingApperancesOfRacer = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.trainingapperance WHERE racerid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

module.exports.getRaceApperancesOfRacer = function(id, useridAccess, callback) {

  if(id == null) {
    callback("Id is null", null);
    return;
  }

  client.query("SELECT * FROM public.raceapperance WHERE racerid = $1", [id])
  .then(res2 => {
    var objects = res2.rows;
    objects.forEach(object => {
      if(!checkIfAccessToData(object, useridAccess)) {
        objects.splice(objects.indexOf(object), 1);
      }
    });
    callback((objects.length == 0 && res2.rows.length > 0) ? "No access to data" : null, objects);
    })
  .catch(e => {
    callback(e, null);
  });
};

