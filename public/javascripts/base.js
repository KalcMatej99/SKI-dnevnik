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

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});