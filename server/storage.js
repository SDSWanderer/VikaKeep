var db     = require('mysql-promise')();
var uuid   = require('node-uuid');
var config = require('./config');
db.configure(config.db);

var storage = {
    getNotesList: function() {
        return db.query('SELECT * FROM notes WHERE isDeleted = 0 ORDER BY id DESC')
        .spread(function(notesFromDB) {
            return notesFromDB;
        });
    },
    createNote: function(note) {
        note.date = new Date();
        return db.query('INSERT INTO notes (text, date) VALUES (?, ?)', [note.text, note.date])
        .spread(function(queryStatus) {
            note.id = queryStatus.insertId;
            return note;
        });
    },
    updateNote: function(newNoteData) {
        newNoteData.date = new Date();
        return db.query('UPDATE notes SET text = ?, date = ? WHERE id = ?', [newNoteData.text, newNoteData.date, newNoteData.id])
        .spread(function() {
            return newNoteData;
        });
    },
    deleteNote: function(note) {
        return db.query('UPDATE notes SET isDeleted = true WHERE id = ?', [note.id])
    },
    createUser: function(user) {
        user.securityCode = uuid.v4();
        return db.query('INSERT INTO users (email, password, securityCode) VALUES (?, ?, ?)', [user.email, user.password, user.securityCode])
        .then(function() {
            return user;
        });
    }
}


module.exports = storage;