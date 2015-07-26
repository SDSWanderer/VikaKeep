var db     = require('mysql-promise')();
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
        return db.query('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password])
        .then(function() {
            return user;
        });
    },
    loginUser: function(user) {
        console.log(user);
        return db.query('SELECT * FROM users WHERE email = ? AND password = ?', [user.email, user.password])
        .then(function() {
            return user;
        });
    }
}


module.exports = storage;