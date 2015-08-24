var db     = require('mysql-promise')();
var bcrypt = require('bcrypt-nodejs');
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
        return db.query('INSERT INTO notes (text, date, user) VALUES (?, ?, ?)', [note.text, note.date, note.user])
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
        return db.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [user.email, user.password, user.name])
        .then(function() {
            return user;
        });
    },
    loginUser: function(user) {

        return db.query('SELECT * FROM users WHERE email = ?', [user.email])
        .spread(function(usersFromDB) {
            var foundUser = usersFromDB[0];
            if (!foundUser) {
                throw "User not exist";
            }

            var isValidPassword = bcrypt.compareSync(user.password+foundUser.salt, foundUser.password);
            if (!isValidPassword) {
                throw "Wrong password";
            }

            return {
                name: user.name,
                email: user.email
            };
        });
    },
    registerUser: function(user) {
        var salt = bcrypt.genSaltSync();
        var hash = bcrypt.hashSync(user.password+salt);

        return db.query('INSERT INTO users (email, password, salt, name) VALUES (?, ?, ?, ?)', [user.email, hash, salt, user.name])
        .spread(function() {
            return {
                name: user.name,
                email: user.email
            };
        })
        .catch(function(error) {
            console.log(error);
            if (error.code == 'ER_BAD_NULL_ERROR') {
                throw "All fields are required";
            }
            if (error.code == 'ER_DUP_ENTRY') {
                throw "Email already exist";
            }
            throw "UNKNOWN ERROR";
        });
    }
}


module.exports = storage;