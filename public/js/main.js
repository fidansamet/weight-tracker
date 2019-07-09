var signin = document.getElementById("signin");
var register = document.getElementById("register");
const username1 = document.getElementById("username1");
const pass1 = document.getElementById("pass1");
const username2 = document.getElementById("username2");
const email2 = document.getElementById("email2");
const pass2 = document.getElementById("pass2");
const showPass1 = document.getElementById("showPass1");
const showPass2 = document.getElementById("showPass2");
var signinForm = document.getElementById("signinForm");
var registerForm = document.getElementById("registerForm");
var signinTab = document.getElementById("signinTab");
var registerTab = document.getElementById("registerTab");

signin.addEventListener("click", function (event) {

    event.preventDefault();

    if (usernameIsValid(username1.value) == false) {
        showValidate(username1);
    }

    if (pass1.value == '') {
        showValidate(pass1);
    }
});

register.addEventListener("click", function (event) {
    event.preventDefault();

    if (usernameIsValid(username2.value) == false) {
        showValidate(username2);
    }

    if (emailIsValid(email2.value) == false) {
        showValidate(email2);
    }

    if (pass2.value == '') {
        showValidate(pass2);
    }
});

signinTab.addEventListener("click", function (e) {
    e.preventDefault();
    signinForm.style.display = "block";
    registerForm.style.display = "none";
});

registerTab.addEventListener("click", function (e) {
    e.preventDefault();
    registerForm.style.display = "block";
    signinForm.style.display = "none";
});

registerForm.style.display = "none";

showPass1.addEventListener("click", function (e) {
    e.preventDefault();
    var temp = document.getElementById("pass1");
    if (temp.type === "password") {
        temp.type = "text";
    }
    else {
        temp.type = "password";
    }
});

showPass2.addEventListener("click", function (e) {
    e.preventDefault();
    var temp = document.getElementById("pass2");
    if (temp.type === "password") {
        temp.type = "text";
    }
    else {
        temp.type = "password";
    }
});


function usernameIsValid(username) {

    if (/^[0-9a-zA-Z_.-]+$/.test(username)) {
        return true;
    }
    return false;
}

function emailIsValid (email) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return true;
    }
    return false;
}

$('.validate-form .input100').each(function(){
    $(this).focus(function(){
        hideValidate(this);
    });
});

function showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
}
