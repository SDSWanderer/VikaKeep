var API = {
    list: function() {
        return fetch('/notes')
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
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(note)
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
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({text: note.text})
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
            method: 'delete',
            headers: { "Content-type": "application/json; charset=UTF-8" },
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

window.API = API;