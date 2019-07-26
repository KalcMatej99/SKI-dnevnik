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