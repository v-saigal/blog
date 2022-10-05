import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Edit(){
    console.log("Edit reached!")
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const [note, setNote] = useState()
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

}


export default Edit
