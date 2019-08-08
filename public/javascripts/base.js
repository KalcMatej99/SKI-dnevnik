/*
    Author: Matej Kalc
    base.js is needed as base for main views (home.html, teams.html, account.html, ...)
*/

var user;
var userHello = false;

//This function saves the user data in variable user, alerts error if occures
function getUser(callback) {
    if(!user) {
        $.get("/user/data", function(data) {
            if(data) {
                user = data;
                if(!userHello) {
                    //alert("Pozdravljen " + user.firstname + "!");
                    userHello = true;
                }
            } else {
                location.href = "/";
                alert("Uporabnik ni bil najden");
            }
            callback();
        });
    } else {
        location.href = "/";
        alert("Uporabnik ni bil najden");
        callback();
    }
}

//This function returns a stringof year, month and day
function parseDate(dateString) {
    var date = new Date(dateString);
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

function getWeatherStringFromIndex(index) {
    switch(index){
        case 1: return "Sončno";
        case 2: return "Oblačno";
        case 3: return "Deževno";
        case 4: return "Vetrovno";
        case 5: return "Snežno";
        case 6: return "Megleno";
        default: return "Neznano vreme";
    }
}

function getDisciplineStringFromIndex(index) {
    switch(index){
        case 1: return "Slalom";
        case 2: return "Veleslalom";
        case 3: return "SuperG";
        case 4: return "Smuk";
        default: return "Neznana disciplina";
    }
}

function getTypeStringFromIndex(index) {
    switch(index){
        case 1: return "Prosto";
        case 2: return "Postavitev";
        default: return "Neznano";
    }
}

function parsePlacementTypeToText(type) {
    switch(type){
        case 1: return "FIN";
        case 2: return "DNF";
        case 3: return "DNS";
        default: return "Neznano";
    }
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

/*

    CHECK IF EXISTS

*/

function checkIfTeamExists(id, callback) {
    $.get("/team/data", {id: id}, function(team) {
        if(team){
            callback(true);
        } else {
            callback(false);
        }
    });
}

function checkIfTrainingExists(id, callback) {
    $.get("/training/data", {id: id}, function(tr) {
        if(tr){
            callback(true);
        } else {
            callback(false);
        }
    });
}

function checkIfRaceExists(id, callback) {
    $.get("/race/data", {id: id}, function(tr) {
        if(tr){
            callback(true);
        } else {
            callback(false);
        }
    });
}

function checkIfRacerExists(id, callback) {
    $.get("/racer/data", {id: id}, function(tr) {
        if(tr){
            callback(true);
        } else {
            callback(false);
        }
    });
}

/*

    NAVIGATION

*/


function navigateToNotFound() {
    window.location.href = "notFound.html";
}

//This function is needed to navigate to training.html
function navigateToTraining(trainingid) {
    window.location.href = "training.html?trainingid=" + trainingid;
}

//This function is needed to navigate to training.html
function navigateToTraining(trainingid) {
    window.location.href = "training.html?trainingid=" + trainingid;
}

function navigateToRacer(racerid) {
    window.location.href = "racer.html?racerid=" + racerid;
}

function navigateToRace(raceid) {
    window.location.href = "race.html?raceid=" + raceid;
}

function navigateToNewRacer(teamid) {
    window.location.href = "addRacer.html?teamid=" + teamid;
}
function navigateToNewRace(teamid) {
    window.location.href = "addRace.html?teamid=" + teamid;
}
function navigateToNewTraining(teamid) {
    window.location.href = "addTraining.html?teamid=" + teamid;
}
function navigateToNewMistake(racerid) {
    window.location.href = "addMistake.html?racerid=" + racerid;
}
function navigateToNewRaceApperance(racerid) {
    window.location.href = "addApperanceRace.html?racerid=" + racerid;
}
function navigateToTeam(teamid) {
    window.location.href = "team.html?teamid=" + teamid;
}

