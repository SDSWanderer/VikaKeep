'use strict';

function dateFormat(date) {
    return date.getDate()+ "."  +
    (date.getMonth() +1) + "."  +
    date.getFullYear()   + ", " +
    date.getHours()      + ":"  +
    date.getMinutes()    + ":"  +
    date.getSeconds();
}

var Note = React.createClass({
    getInitialState() {
        return {
            id:        this.props.id,
            date:      this.props.date,
            text:      this.props.text,
            isDeleted: false
        };
    },

    handleDelete() {
        this.props.onDelete(this.state.id).then(() => {
            this.setState({isDeleted: true});
        });
    },

    handleUpdate() {
        var newText = React.findDOMNode(this.refs.input).value.trim();
        this.props.onUpdate({id: this.state.id, text: newText}).then(note => {
            this.setState({ date: note.date });
        });
    },

    render() {
        if (this.state.isDeleted) return null;

        return (
            <div className='note-container'>
                <div className='delete-button' onClick={this.handleDelete}/>

                <textarea
                    onBlur={this.handleUpdate}
                    ref='input'
                    defaultValue={this.state.text}
                />

                <div className='date' ref='date'>
                    {dateFormat(this.state.date)}
                </div>
            </div>
        );
    }
});

var CreateNoteForm = React.createClass({
    handleSave() {
        var input = React.findDOMNode(this.refs.input);
        this.props.onSave({text: input.value.trim()}).then(() => {
            input.value = '';
        });
    },

    render() {
        var textareaStyle = {
            width:   '100%',
            padding: '10px',
        };

        return (
            <div className="new-note-container">
                Enter your note...
                <textarea style={textareaStyle} ref='input' />
                <input type="button" value="Save" onClick={this.handleSave} />
            </div>
        );
    }
});

var NotesList = React.createClass({
    render() {
        var divStyle = {
            margin: '0% 20%'
        };

        var notes = this.props.notes.map(note => {
            return (
                <Note
                    key={note.id}
                    id={note.id}
                    text={note.text}
                    date={note.date}
                    onUpdate={this.props.onUpdate}
                    onDelete={this.props.onDelete}
                />
            );
        });

        return (
            <div style={divStyle}>
                {notes}
            </div>
        );
    }
});

var NotesBox = React.createClass({
    getInitialState() {
        return {
            notes: []
        }
    },

    componentDidMount() {
        this.getNotes();
    },

    getNotes() {
        return API.list().then(notes => {
            this.setState({notes: notes.data})
        });
    },

    saveNote(note) {
        return API.create(note).then(note => {
            this.setState({notes: [note].concat(this.state.notes)})
        });
    },

    updateNote(note) {
        return API.update(note);
    },

    deleteNote(id) {
        return API.delete(id);
    },

    render() {
        return (
            <div>
                <CreateNoteForm onSave={this.saveNote}/>
                <NotesList
                    notes={this.state.notes}
                    onUpdate={this.updateNote}
                    onDelete={this.deleteNote}
                />
            </div>
        );
    }
});

React.render(
    <NotesBox />,
    document.body
);
