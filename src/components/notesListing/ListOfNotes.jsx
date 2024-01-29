import React from 'react'
import { useState, useRef } from 'react';
import './listOfNotes.css'
import ShowNotes from './ShowNotes';
import noGroupSelectedImg from '../../images/image-removebg-preview.svg';
import lockIcon from '../../images/lock.svg';
import goBack from '../../images/back-arrow.svg';
import sendArrowBlue from '../../images/blue-arrow.jpg';
import sendArrowGrey from '../../images/grey-arrow.jpg';



let everyNotes = {};

function ListOfNotes(props) {

    /* Filter the groups to find the selected group based on its id
    [0] selects the first element from the filtered array representing selected group*/
    let selectedGroupName = props.everyGroup.filter((selGrp) => selGrp.id == props.selectedGroup)[0];

    // Create a ref to store a reference to the note input field 
    let noteInputRef = useRef('');

    let [eachNotes, setEachNotes] = useState(everyNotes)
    const [arrowColor, setArrowColor] = useState();

    // Retrieve and parse the 'Notes' data from localStorage
    everyNotes = JSON.parse(localStorage.getItem('Notes'));

    // Check if everyNotes is undefined, and initialize it as an empty object if true
    if (everyNotes == undefined) {
        everyNotes = {};
    }

    //After clicking submit on notes arrow, this function is responsible for handling validation and adding notes to existing/new array 
    function submitNote() {

        // Check if the input is empty
        if (noteInputRef.current.value.trim() == "") {
            alert("Cannot save empty message")
            return;
        }
        // Create a new note object with the current date and input value
        let note = {
            date: new Date().toString(),
            inp_note: noteInputRef.current.value
        }

        // Clear the input field
        noteInputRef.current.value = "";

        // Check if notes exist for the selected group
        if (Object.keys(everyNotes).includes(selectedGroupName.id)) {

            // Add the new note to the existing array of notes for the selected group
            everyNotes[selectedGroupName.id].push(note)
        }
        else {
            // If there are no existing notes for the selected group, create a new array with the new note
            everyNotes = { ...everyNotes, [selectedGroupName.id]: [note] }
        }

        // Update the state with the modified notes object
        setEachNotes(everyNotes)

        // Store the notes object in the localStorage
        localStorage.setItem('Notes', JSON.stringify(everyNotes))
    }

    //Changes arrow color when user writes something in text area
    const handleInputChange = () => {
        setArrowColor(noteInputRef.current.value);
    };


    return (
        <section className='rightSection'>
            {!props.selectedGroup ? //when no group is selected show  default design
                <div className='defaultSection' >

                    <div className='defaultMessageWrapper' >
                        <img
                            style={{ width: "100%" }}
                            src={noGroupSelectedImg}>
                        </img>
                        <h1 className='rightHeading'>Pocket Notes</h1>
                        <p>Send and receive messages without keeping your phone online.
                            <br />
                            Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
                    </div>

                    <div className='encryptMsg'>
                        <p> <img src={lockIcon} /> end-to-end encrypted</p>
                    </div>
                </div>

                : //if any group is selected show that particular group notes with date and time created & text area to add new notes to selected group

                <div className='displayNotesContainer'>

                    <div className='notesHeading'>
                        {!props.isBigScreen && // if screen is not big , show goBack arrow , clicking it will change the state from selected to not selected and return to group lists
                            <div className='backBtnDiv' onClick={() => { props.setSelectedGroup((selected) => !selected) }}>
                                <img src={goBack} />
                            </div> //
                        }

                        {/*Shows Icon and First 2 Letters of Group Name */}
                        <div
                            style={{ background: selectedGroupName.color }}
                            className='navGroupIcon'>
                            {selectedGroupName.name.slice(0, 2).toUpperCase()}
                        </div>

                        {/*Show Selected Group Name */}
                        <div className='groupNameRightSide'>
                            {selectedGroupName.name}
                        </div>
                    </div>


                    {/*Conditional rendering to render div element and check if id exists as a key(basically previous notes),
                     if key exists maps through note object and renders ShowNotes Component*/}
                    <div className='showAllNotes'>
                        {Object.keys(eachNotes).includes(selectedGroupName.id) &&
                            eachNotes[selectedGroupName.id]
                                .map((note) => (
                                    <ShowNotes key={note.date} date={note.date} note={note.inp_note} />
                                ))}
                    </div>


                    {/*Text Area and Submit*/}
                    <div className='userInputContainer'>
                        <textarea ref={noteInputRef} className='textInput textInputPlaceholder' placeholder='Enter your text here.... ' onInput={handleInputChange}></textarea>
                        <img onClick={submitNote} src={arrowColor ? sendArrowBlue : sendArrowGrey} className='sendArrow' />
                    </div>

                </div>
            }
        </section>
    )
}

export default ListOfNotes