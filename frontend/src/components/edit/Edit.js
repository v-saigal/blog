import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Edit({navigate}){
    const [token, setToken] = useState(window.localStorage.getItem("token"));

    let userId;
    if (token === "fakeToken") {userId = 'TestUser'} else {userId = jwt_decode(token).user_id} // Means that tests won't use jwt_decode and therefore won't through errors    const [token, setToken] = useState(window.localStorage.getItem("token"));
    // const [note, setNote] = useState([])
    let userId;
    if (token === "fakeToken") {userId = 'TestUser'} else {userId = jwt_decode(token).user_id} // Means that tests won't use jwt_decode and therefore won't through errors

    const [noteValues, setNoteValues] = useState({title:"", noteContent:"", noteAuthor:userId, tags:[]});
    const [counter, setCounter] = useState(0)
    const params = useParams();

    useEffect(() => {
        if(token) {
          fetch(`/notes/${params.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(response =>
              response.json())
            .then(async data => {
              window.localStorage.setItem("token", data.token)
              setToken(window.localStorage.getItem("token"))
              // setNoteValues(data.note);
              console.log("---------------------------------")
              function getTagNames() {
                return data.note.tags.map( (tagObj) => tagObj.name).join(", ")
              }
              console.log(data.note)
              setNoteValues({
                 _id: data.note._id,
                 title: data.note.title,
                 noteContent: data.note.noteContent,
                 tags: getTagNames()
             });
              console.log(noteValues.tags)
            })

        }
      }, [counter])

      /*
    noteValues.tags = noteValues.tags.split(",")  //.replace(/[^,a-zA-Z0-9]/g,' ,')
     fetch('/tags', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( noteValues.tags )
    }).then((response) => {
      response.json().then((data) => {
        noteValues.tags = []
        data.tag.forEach((tag) => {
          noteValues.tags.push(tag._id)
        }
      */

      console.log(noteValues);

      const handleSubmit = async (event) => {
        event.preventDefault();
        noteValues.tags = noteValues.tags.split(",")  //.replace(/[^,a-zA-Z0-9]/g,' ,')
        console.log(noteValues.tags)
        fetch('/tags', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( noteValues.tags )
        }).then((response) => {
          response.json().then((data) => {
            noteValues.tags = []
            data.tag.forEach((tag) => {
              noteValues.tags.push(tag._id)
            })
        fetch( '/notes/update', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({_id: params.id, noteContent: noteValues.noteContent, title: noteValues.title, noteAuthor: userId, tags: noteValues.tags })
        })
          .then(response => {
            if(response.status === 200) {
              setCounter(counter + 1)
              setNoteValues({title:"", noteContent:"", noteAuthor:userId, tags:[]})
              navigate('/notes')
            } else {
              alert('oops something is wrong')
            }
          })
        })
      })
      }

      // Updated
      function handleNoteChange(event){
        const {name, value} = event.target;
        setNoteValues({
           ...noteValues,
            [name]: value,
        });
      }


      return (
        <>
            <div>
            <form className="postForm" onSubmit={handleSubmit}>
              <input type="text" name="title" value={noteValues.title} onChange={handleNoteChange}/>
              <textarea id="postarea" name="noteContent" value={ noteValues.noteContent } onChange={handleNoteChange} placeholder="Write your note here"></textarea>
              <input type="text" name="tags" value={noteValues.tags} onChange={handleNoteChange}/>

              <input id='submit' type="submit" value="Save a note" />
            </form>
      </div>
      </>
      )
}


export default Edit
