import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Edit({navigate}){
    console.log("Edit reached!")
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    let userId;
    if (token === "fakeToken") {userId = 'TestUser'} else {userId = jwt_decode(token).user_id} // Means that tests won't use jwt_decode and therefore won't through errors

    // const [note, setNote] = useState([])
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
              setNoteValues(data.note);
            })

        }
      }, [counter])

      console.log(noteValues);

      const handleSubmit = async (event) => {
        event.preventDefault();
        fetch( '/notes/update', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({_id: params.id, noteContent: noteValues.noteContent, title: noteValues.title, noteAuthor: userId })
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
      }

      // Initial 
      // const handleNoteChange = (event) => {
      //   setNote(event.target.value)   
      // }

      // Updated
      function handleNoteChange(event){

        const {name, value} = event.target;
        setNoteValues({
           ...noteValues,
            [name]: value
        });
      };

      return (
        <>
            <div>
            <form className="postForm" onSubmit={handleSubmit}>
              <input type="text" name="title" value={noteValues.title} onChange={handleNoteChange}/>
              <textarea id="postarea" name="noteContent" value={ noteValues.noteContent } onChange={handleNoteChange} placeholder="Write your note here"></textarea>

              <input id='submit' type="submit" value="Save a note" />
            </form>
      </div>
      </>
      )
}


export default Edit
