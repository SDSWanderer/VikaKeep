var email    = document.getElementById('email');
var password = document.getElementById('password');
var error    = document.getElementById('error');

document.getElementById('regButton').onclick = function() {
    router.register();
};

document.getElementById('submitButton').onclick = function() {
    var user = {
        email: email.value,
        password: password.value
    };

    API.users.login(user)
    .then(function(response){
        if (response.status == 1) {
           router.notes();
        }
        else {
            error.style.visibility = "visible";
        }
    })
}