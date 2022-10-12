import React, { useEffect, useState } from 'react';
import Note from '../note/Note'
import jwt_decode from "jwt-decode";
import './Feed.css';



const Feed = ({ navigate }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  let userId;
  if (token === "fakeToken") {userId = 'TestUser'} else {userId = jwt_decode(token).user_id} // Means that tests won't use jwt_decode and therefore won't through errors
  const [noteValues, setNoteValues] = useState({title:"", noteContent:"", noteAuthor:userId, tags:[], articleImage:''});
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedNote, setSelectedNote] = useState("")
  const [selectedNotes, setSelectedNotes] = useState("")

  const [counter, setCounter] = useState(0)

  // search
  const [query, setQuery] = useState("")

  const onChangeFile = e => {
    setFileName(e.target.files[0]);
    console.log(e.target.files)
    console.log(fileName)
  }


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

          let tagList = []
          data.notes.forEach(note => {
            note.tags.forEach(tag =>{
              const i = tagList.map(e => e.name).indexOf(tag.name)
              console.log(i)
              if (i > -1){
                console.log("hit if")
                tagList[i].notes.push(note)
              }else{
                console.log("hit else")
                tagList.push({name:tag.name, tagId:tag.id, notes:[note]})
              }
            })

          })
          setTags(tagList);
        })

    }
  }, [counter])



  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', noteValues.title)
    formData.append('noteContent', noteValues.noteContent)
    formData.append('noteAuthor', noteValues.noteAuthor)
    formData.append('articleImage', fileName)
    console.log(formData);


    const regEx = /[a-zA-Z0-9]+,/
    if(regEx.test(noteValues.tags.trim().replace(/\s/g,''))) {
    noteValues.tags = noteValues.tags.trim().replace(/\s/g,'').split(",")  //.replace(/[^,a-zA-Z0-9]/g,' ,')
     fetch('/tags', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( noteValues.tags )
    }).then((response) => {
      console.log(noteValues)
      response.json().then((data) => {
        noteValues.tags = []
        data.tag.forEach((tag) => {
          noteValues.tags.push(tag._id)
        })
        formData.append('tags', JSON.stringify(noteValues.tags))
        fetch( '/notes', {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
          .then(response => {
            if(response.status === 201) {
              setCounter(counter + 1)
              setNoteValues({title:"", noteContent:"", noteAuthor:userId, tags:[], articleImage:''})
              navigate('/notes')
            } else {
              alert('oops something is wrong')
            }
          })
        navigate('/notes')
      })

    })
  } else if(!regEx.test(noteValues.tags)) {
    alert('The given tag formatting is wrong. Only letters and numbers accepted. Use commas to separate the tags. Example: tag1, tag2, tag3')
    return;
  }
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
    //console.log(fileName)
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

  function updateSelectedTag(value){
    setSelectedTag(value)
    setSelectedNotes(value.notes)
    setSelectedNote("")
  }
  function updateSelectedNote(value){
    console.log(value)
    setSelectedNote(value)
  }
  const tagButtonList = () =>{
    return (<ul>
      {tags.map((tag) =>
      <div>
          <button type="button" value={tag} onClick={()=> updateSelectedTag(tag)}>{tag.name} {tag.notes.length}</button>
        </div>
      )}
    </ul>)
  }

  function noteButtonList(){
  if(selectedNotes !="")
  {return (<ul>
    {selectedNotes.map((note) =>
    <div>
        <button type="button" value={note} onClick={()=> updateSelectedNote(note)}>{note.title}</button>
      </div>
    )}
  </ul>)}
  }

  const viewNote = () => {
    if (selectedNote != ""){
      return (
        <div>

            <Note note={ selectedNote } key={ selectedNote._id } token={ token } userId={userId} title={ selectedNote.title } tags={ selectedNote.tags } counterChanger={ setCounter }/>

        </div>
      )
    }
  }



  if(token) {
    return(
      <>

        <div className="container-fluid">

          {/* <i class="bi bi-brightness-high-fill dark-toggle"></i> */}

          <div className="container-fluid">
            <div className="row">

                <div className="tags-list border border-dark col-2 view-height">
                  { tagButtonList() }
                </div>

                <div className="titles-list border border-dark col-4 view-height">
                  <i class="bi bi-search"></i>
                  <input className='w-75 search-area' placeholder="Search" onChange={event => setQuery(event.target.value)} />

                  {notes
                   .filter(note => { return note.title.includes(query) || note.noteContent.includes(query) || note.tags.includes(query)})

                    .map((note) => ( <Note note={ note } key={ note._id } token={ token } userId={userId} title={ note.title } tags={ note.tags } counterChanger={ setCounter }/> ))
                  }
                </div>

                <div className="border border-dark col-6 view-height">

                  <form className="postForm" onSubmit={handleSubmit} encType='multipart/form-data'>
                    <input className='w-100 border' type="text" name="title" onChange={handleNoteChange} value={ noteValues.title }placeholder="Enter a title" required/>
                    <input className='w-100 border' type="text" name="tags" onChange={handleNoteChange} value={ noteValues.tags }placeholder="Enter tags e.g. tag1, tag2, tag3" />
                    <textarea className='w-100 border textBox' id="postarea" name="noteContent" onChange={handleNoteChange} value={ noteValues.noteContent } placeholder="Write your note here"></textarea>

                    <div className="clearfix"></div>

                    <div className='form-group'>
                      {/* <label htmlFor='file'> Choose post image</label> */}
                      <input type='file' id='articleImage' name='articleImage' filename='articleImage' className='form-control-file float-start btn btn-primary' onChange={onChangeFile}/>
                      <div className=""></div>
                      <input className='float-end btn btn-primary' id='submit' type="submit" value="Add a note" />
                    </div>
                  </form>

                  <div className="clearfix"></div>

                  {/* display of note/image in column 3 on right */}
                  <div className="notes-display border border-dark h-50" id='notes-display' name="notes-display"></div>

                </div>

            </div>
          </div>
        </div>

      </>
    )
  } else {
    navigate('/signin')
  }
}

export default Feed;
