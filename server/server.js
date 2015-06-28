var fs         = require('fs');
var express    = require('express');
var bodyParser = require('body-parser');
var config     = require('./config');
var storage    = require('./storage');

var app        = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('../client'));

app.get('/notes', function(req, res) {
    storage.getNotesList()
    .then(function(notesList){
        res.send({ data: notesList });
    });
});

app.post('/notes', function(req, res) {
    storage.createNote(req.body)
    .then(function(note) {
        res.send({
            data: note,
            status: 1
        });
    });
});

app.post('/notes/:id', function(req, res) {
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

app.delete('/notes/:id', function(req, res) {
    storage.deleteNote({ id: req.params.id })
    .then(function(){
        res.send({status: 1})
    });
});


app.listen(config.port);