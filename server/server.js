var fs           = require('fs');
var express      = require('express');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var config       = require('./config');
var storage      = require('./storage');

var app = express();

app.use(cookieParser(config.secret));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('../client'));

var auth = function(req, res, next) {
    var email = req.signedCookies.email;
    console.log(req.signedCookies);

    if (email) return next();
    res.send({
        status: 0,
        error: "Permission denied"
    });
};

app.get('/notes', auth, function(req, res) {
    storage.getNotesList()
    .then(function(notesList){
        res.send({ data: notesList });
    });
});

app.post('/notes', auth, function(req, res) {
    var note  = req.body;
    note.user = req.signedCookies.email;

    storage.createNote(note)
    .then(function(note) {
        res.send({
            data:   note,
            status: 1
        });
    });
});

app.post('/notes/:id', auth, function(req, res) {
    var newNoteData  = req.body;
    newNoteData.id   = req.params.id;

    storage.updateNote(newNoteData)
    .then(function(newNoteData) {
        res.send({
            data: newNoteData,
            status: 1
        });
    });
});

app.delete('/notes/:id', auth, function(req, res) {
    storage.deleteNote({ id: req.params.id })
    .then(function() {
        res.send({status: 1})
    });
});

app.post('/users/login', function(req, res) {
    storage.loginUser(req.body)
    .then(function(user) {
        res.cookie("email", user.email, {signed: true, httpOnly: false})
        res.send({
            data: user,
            status: 1
        });
    })
    .catch(function(error){
        res.send({
            status: 0,
            error: error
        })
    })
});

app.listen(config.port);