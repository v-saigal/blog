import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Edit({navigate}){
    console.log("Edit reached!")
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const [note, setNote] = useState([])
    const [counter, setCounter] = useState(0)
    const params = useParams();

    let userId;
    if (token === "fakeToken") {userId = 'TestUser'} else {userId = jwt_decode(token).user_id} // Means that tests won't use jwt_decode and therefore won't through errors

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
              setNote(data.note);
            })

        }
      }, [counter])

      console.log(note);

      const handleSubmit = async (event) => {
        event.preventDefault();
        fetch( '/notes/update', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({_id: params.id, noteContent: note, noteAuthor: userId })
        })
          .then(response => {
            if(response.status === 200) {
              setCounter(counter + 1)
              setNote("")
              navigate('/notes')
            } else {
              alert('oops something is wrong')
            }
          })
      }

      const handleNoteChange = (event) => {
        setNote(event.target.value)   
      }


      return (
        <>
        <div>
          <p>
          {note.noteContent}
          </p>
        </div>
            <div>
            <form className="postForm" onSubmit={handleSubmit}>
              <textarea id="postarea" name="postarea" value={ note.noteContent } onChange={handleNoteChange} placeholder="Write your note here"></textarea>

              <input id='submit' type="submit" value="Save a note" />
            </form>
      </div>
      </>
      )
}


export default Edit
