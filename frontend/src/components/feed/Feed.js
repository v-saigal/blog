import React, { useEffect, useState } from 'react';
// import Post from '../post/Post'
import Note from '../note/Note'
import './Feed.css'
import jwt_decode from "jwt-decode";


const Feed = ({ navigate }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  let userId;
  if (token === "fakeToken") {userId = 'TestUser'} else {userId = jwt_decode(token).user_id} // Means that tests won't use jwt_decode and therefore won't through errors
  const [noteValues, setNoteValues] = useState({title:"", noteContent:"", noteAuthor:userId, tags:[]});
  // const [posts, setPosts] = useState([]);
  const [notes, setNotes] = useState([]);

  // const [post, setPost] = useState()
  const [note, setNote] = useState()
  const [counter, setCounter] = useState(0)

  // search
  const [query, setQuery] = useState("")


  useEffect(() => {
    if(token) {
      fetch("/notes", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response =>
          response.json())
        .then(async data => {
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          setNotes(data.notes);
        })

    }
  }, [counter])



  const handleSubmit = async (event) => {
    event.preventDefault();
    noteValues.tags = noteValues.tags.split(",")
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
        fetch( '/notes', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(noteValues)
        })
          .then(response => {
            if(response.status === 201) {
              setCounter(counter + 1)
              setNoteValues({title:"", noteContent:"", noteAuthor:userId, tags:[]})
              navigate('/notes')
            } else {
              alert('oops something is wrong')
            }
          })
        navigate('/notes')



      })

    })







  }


  const logout = () => {
    window.localStorage.removeItem("token")
    navigate('/login')
  }

  function handleNoteChange(event){

    const {name, value} = event.target;
    setNoteValues({
       ...noteValues,
        [name]: value
    });
  };

  //button back to top
  let mybutton = document.getElementById("myBtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }


    if(token) {
      return(
        <>
          <div>
            <form className="postForm" onSubmit={handleSubmit}>
              <input type="text" name="title" onChange={handleNoteChange} value={ noteValues.title }placeholder="Enter a title" required/>
              <input type="text" name="tags" onChange={handleNoteChange} value={ noteValues.tags }placeholder="Enter tags" />
              <textarea id="postarea" name="noteContent" onChange={handleNoteChange} value={ noteValues.noteContent } placeholder="Write your note here"></textarea>
              <input id='submit' type="submit" value="Add a note" />
            </form>
          </div>



          {/* search function */}
          <input placeholder="Enter Post Title" onChange={event => setQuery(event.target.value)} />

          {/* notes output */}
          {console.log(notes)}
          {notes
            .filter(note => { return note.title.includes(query) || note.noteContent.includes(query) || note.tags.includes(query)})

            .map((note) => ( <Note note={ note } key={ note._id } token={ token } userId={userId} title={ note.title } tags={ note.tags } counterChanger={ setCounter }/> ))
          }

          {/* back to top button */}
          <button onClick= {topFunction} id="myBtn" title="Go to top">Top</button>
        </>
      )
    } else {
      navigate('/signin')
    }
}

export default Feed;

