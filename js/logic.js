var crosscheck=false; // used to make sure both name fields are good
var fnameCleared = false; // used to check if user has entered name fields
var lnameCleared = false; // used to check if user has entered name fields

//modal objects
var modal = document.getElementById('myModal');

// submission button final check
function submitForm() {
    // This was done the way it was because it appears the javascript has lazy evaluation,
    // I wanted the validations to all check regardless to invoke feedback where needed.
    var validationCheck = true;
    if (!validateFirstName()) {
        validationCheck = false;
    }
    if (!validateLastName()) {
        validationCheck = false;
    }
    if (!validateEmail()) {
        validationCheck = false;
    }
    if (!validatePassword()) {
        validationCheck = false;
    }
    if (!validateConfirmedPassword()) {
        validationCheck = false;
    }
    if (!validateAddress()) {
        validationCheck = false;
    }
    if (!validatePostal()) {
        validationCheck = false;
    }
    if (validationCheck == true) {
        // user object
        var user = {firstname: document.forms["signupform"]["firstname"].value,
                    lastname: document.forms["signupform"]["lastname"].value,
                    email: document.forms["signupform"]["email"].value,
                    pass: document.forms["signupform"]["password"].value,
                    country: document.forms["signupform"]["country"].value,
                    address: document.forms["signupform"]["address"].value,
                    postalcode: document.forms["signupform"]["postal"].value};

        jsonUser = JSON.stringify(user);

        // form submission to db
        $.ajax({
            type: 'POST',
            url: '/',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: jsonUser,
            success: function(data) {
                //modal objects
                var modal = document.getElementById('myModal');
                var span = document.getElementsByClassName("close")[0];
                var confirmationFeedback = document.getElementById("confirmationString");

                var constructionString = "";
                constructionString += "Name: " + document.forms["signupform"]["firstname"].value + " " + document.forms["signupform"]["lastname"].value + "<br />";
                constructionString += "Email: " + document.forms["signupform"]["email"].value + "<br />";
                constructionString += "Country: " + document.forms["signupform"]["country"].value + "<br />";
                if (document.forms["signupform"]["address"].value != "") {
                    constructionString += "Address: " + document.forms["signupform"]["address"].value + "<br />";
                }
                if (document.forms["signupform"]["postal"].value != "") {
                    constructionString += "Postal Code: " + document.forms["signupform"]["postal"].value + "<br />";
                }

                confirmationFeedback.innerHTML = constructionString;

                modal.style.display = "block";

                var span = document.getElementsByClassName("close")[0];

                // modal logic, get rid upon hitting x or clicking out of box
                span.onclick = function() {
                    modal.style.display = "none";
                    window.location.reload()
                }

                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                        window.location.reload()
                    }
                }
            }
        })
    }
}

// Validation Methods on Blur
function validateFirstName() {
    var fn = document.forms["signupform"]["firstname"].value;
    if (fn == "" || fnameCleared == false) {
        document.getElementById("nameFeedback").innerHTML="You cannot leave this empty.";
        return false;
    }
    else if (!isAlpha(fn)) {
        document.getElementById("nameFeedback").innerHTML="Your name must have alphabetic characters only.";
        return false;
    }

    if (crosscheck == false) {
        crosscheck = true;
        validateLastName();
        crosscheck = false;
    }

    document.getElementById("nameFeedback").innerHTML="";

    return true;
}

function validateLastName() {
    var ln = document.forms["signupform"]["lastname"].value;
    if (ln == "" || lnameCleared == false) {
        document.getElementById("nameFeedback").innerHTML="You cannot leave this empty.";
        return false;
    }
    else if (!isAlpha(ln)) {
        document.getElementById("nameFeedback").innerHTML="Your name must have alphabetic characters only.";
        return false;
    }

    if (crosscheck == false) {
        crosscheck = true;
        validateFirstName();
        crosscheck = false;
    }

    document.getElementById("nameFeedback").innerHTML="";

    return true;
}

function validateEmail() {
    var email = document.forms["signupform"]["email"].value;
    if (email == "") {
        document.getElementById("emailFeedback").innerHTML="You cannot leave this empty.";
        return false;
    }
    else if (!validateEmailText(email)) {
        document.getElementById("emailFeedback").innerHTML="You must enter a valid email address.";
        return false;
    }

    document.getElementById("emailFeedback").innerHTML="";

    return true;
}

function validatePassword() {
    var pass = document.forms["signupform"]["password"].value;
    if (pass == "") {
        document.getElementById("passFeedback").innerHTML="You cannot leave this empty.";
        return false;
    }
    else if (pass.length < 8) {
        document.getElementById("passFeedback").innerHTML="Your password must be at least 8 characters long.";
        return false;
    }

    document.getElementById("passFeedback").innerHTML="";

    return true;
}

function validateConfirmedPassword() {
    var confp = document.forms["signupform"]["confirmedpass"].value;
    var password = document.forms["signupform"]["password"].value;

    if (confp == "") {
        document.getElementById("confPassFeedback").innerHTML="You cannot leave this empty.";
        return false;
    }
    else if (confp != password) {
        document.getElementById("confPassFeedback").innerHTML="This must be the same as your given password.";
        return false;
    }

    document.getElementById("confPassFeedback").innerHTML="";

    return true;
}

function validateAddress() {
    var addr = document.forms["signupform"]["address"].value;

    if (!isAlphanumeric(addr)) {
        document.getElementById("addressFeedback").innerHTML="Your address can only contain alphanumeric characters.";
        return false;
    }

    document.getElementById("addressFeedback").innerHTML="";

    return true;
}

function validatePostal() {
    var postal = document.forms["signupform"]["postal"].value;

    if (!isAlphanumeric(postal)) {
        document.getElementById("postalFeedback").innerHTML="Your postal code can only contain alphanumeric characters.";
        return false;
    }

    document.getElementById("postalFeedback").innerHTML="";

    return true;
}

function clearFnameField() {
    if (fnameCleared == false) {
        document.getElementById("inFname").value="";
        document.getElementById("inFname").style.color = "black";
    }
    fnameCleared = true;
}

function clearLnameField() {
    if (lnameCleared == false) {
        document.getElementById("inLname").value="";
        document.getElementById("inLname").style.color = "black";
    }
    lnameCleared = true;
}



// generic string checking functions
function isAlpha(name) {
  return /^[a-zA-Z]+$/.test(name);
}

function validateEmailText(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isAlphanumeric(str){
    if( /[^a-zA-Z0-9 ]/.test(str)) {
       return false;
    }
    return true;     
 }
