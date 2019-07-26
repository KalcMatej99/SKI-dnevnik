/*
    Author: Matej Kalc

    baseUserAuthentication.js is used from user authentication pages (register.html, login.html, ...)
    to share common function
*/


//This function checks if the password is in a valid format
function isPasswordValid(password) {
    if(password.length >= 8 && password.length <= 20) {
        return true;
    }
    return false;
}
  
//This function checks if the email is in a valid format
function isEmailValid(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
}