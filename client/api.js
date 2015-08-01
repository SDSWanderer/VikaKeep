var notes = {
    list: function() {
        return fetch('/notes', {
            credentials: "same-origin"
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(resivedFromServerNotes) {
            console.log(resivedFromServerNotes);
            for (var i = 0; i < resivedFromServerNotes.data.length; i++) {
                resivedFromServerNotes.data[i].date = new Date(resivedFromServerNotes.data[i].date);
            }
            return resivedFromServerNotes;
        })
    },
    create: function(note) {
        return fetch('/notes', {
            method:  'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body:    JSON.stringify(note),
            credentials: "same-origin"
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(resivedFromServerNote) {
            var noteFromServer  = resivedFromServerNote.data
            noteFromServer.date = new Date(noteFromServer.date);
            return noteFromServer;
        });
    },
    update: function(note) {
        return fetch('/notes/' + note.id, {
            method:  'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body:    JSON.stringify({text: note.text}),
            credentials: "same-origin"
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(resivedFromServerNote) {
            var noteFromServer  = resivedFromServerNote.data
            noteFromServer.date = new Date(noteFromServer.date);
            return noteFromServer;
        });
    },
    delete: function(noteID) {
        return fetch('/notes/' + noteID, {
            method:  'delete',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            credentials: "same-origin"
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(status) {
            console.log(status)
            return status;
        });
    }
};

var users = {
    login: function(user) {
        return fetch('/users/login', {
            method:  'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body:    JSON.stringify(user),

        })
        .then(function(response) {
            return response.json();
        })
        .then(function(status) {
            console.log(status)
            return status;
        });
    }

}

window.API = {
    notes: notes,
    users: users
};