import React from 'react';
import { useState } from 'react';
import './component.css';

function Piano() {
    const allnotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const [noteslist, setNoteslist] = useState([{id:0, note: ''}]);
    const handleClickNote = (item: string) => {
        console.log(item);
        setNoteslist([...noteslist, {id:noteslist.length, note:item}])
    }
    console.log(noteslist);

    return (
        <>
            <h1>piano</h1>
            <div className='piano-container'>
                {allnotes.map((item) => (
                    <div
                    key={item}
                    onClick={() => {handleClickNote(item);}}>
                        {item}
                    </div>
                ))}
            </div>
            <h1>display</h1>
            <div className='piano-container'>
                {noteslist.map((item) => (
                    <div>
                        {item.note}
                    </div>
                ))}

            </div>
            <button>delete</button>
        </>
    )
}

export default Piano