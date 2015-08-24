var notesList      = document.getElementById('notesList'); //найти див для расположения заметок
var newNoteInput   = document.getElementById('newNoteInput'); // найти текстареа для ввода текста новой заметки

API.notes.list().then(function(notesFromServer) {
    for (var i = 0; i < notesFromServer.data.length; i++) {
        var resivedFromServerNote  = notesFromServer.data[i];
        var newNoteContainer       = showNote(resivedFromServerNote); //создание дива с текстом и датой заметки из массива
        notesList.appendChild(newNoteContainer);
    }; //цикл который запихивает заметки из массива в дивы
})
.catch(function(error) {
    if (error == "Permission denied") {
        return router.login();
    }

    alert("Some bullshit! " + error);
})
;

document.getElementById('logoutButton').onclick = function() {
    API.users.logout()
    .then(function(response){
        if (response.status) {
           router.login();
        }
    })
};

document.getElementById('addButton').onclick = function() {
    var note = {
        text: newNoteInput.value,
    };

    API.notes.create(note).then(function(noteFromServer) {
        var newNoteContainer = showNote(noteFromServer); //создание дива с текстом и датой только что введенной заметки
        notesList.insertBefore(newNoteContainer, notesList.firstChild); //1 аргумент - что вставлять, 2ой - куда
        newNoteInput.value = "";
        console.log(noteFromServer);
    });
};

function dateFormat(date) {
    return date.getDate()+ "."  +
    (date.getMonth() +1) + "."  +
    date.getFullYear()   + ", " +
    date.getHours()      + ":"  +
    date.getMinutes()    + ":"  +
    date.getSeconds();
}

function showNote(note) {
    var newNoteContainer   = document.createElement('div'); //создание нового дива в виде объекта
    var newTextArea        = document.createElement('textarea');
    var deleteButton       = document.createElement('div');
    var newDateContainer   = document.createElement('div');

    newTextArea.onblur     = function() {
        API.notes.update({id: note.id, text: this.value}).then(function(noteFromServer) {
            newDateContainer.innerHTML = dateFormat(noteFromServer.date);
        })
    }

    deleteButton.onclick   = function() {
        API.notes.delete(note.id).then(function() {
            newNoteContainer.style.display = "none";
        })
    }

    newNoteContainer.appendChild(deleteButton);
    newNoteContainer.appendChild(newTextArea);
    newNoteContainer.appendChild(newDateContainer);

    newNoteContainer.className = 'note-container'; //свойства объекта
    newDateContainer.className = "date";
    deleteButton.className     = "delete-button";

    newTextArea.innerHTML      = note.text; //свойствo объекта
    newDateContainer.innerHTML = dateFormat(note.date);

    return newNoteContainer;
}
