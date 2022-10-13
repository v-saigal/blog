import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Note.css';



const Note = (props) => {

  //const [comment, setComment] = useState();
  //const [showCommentForm, setShowCommentForm] = useState(false);

  const date = new Date(props.note.datePosted).toLocaleDateString("en-uk", {
      // hour: "2-digit",
      // minute: "2-digit",
      year: "numeric",
      month: "short",
      weekday: "long",
      day: "numeric",
      })

      function refreshPage(){ 
        window.location.reload();
      }

      const deleteFunction = async (event) => {
        event.preventDefault();
        fetch( '/notes', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${props.token}`
          },
          body: JSON.stringify({ _id: props.note._id })
        })
          .then(response => {
            if(response.status === 201) {
              console.log('OK')
            } else {
              alert('oops something is wrong')
            }
          }).then(() => {props.counterChanger(prevState => ({count: prevState.counter + 1}))})
          refreshPage()
      }

      const deleteBtnAppears = (() => {if (props.note.noteAuthor===props.userId) {return <button onClick= {deleteFunction} className={"like"} id={"deleteBtn"} title={"Delete note"}>Delete</button>}})
      
      const editLinkAppears = (() => {
        if (props.note.noteAuthor===props.userId){
          return ( 
          <form action={`/notes/edit/${props.note._id}`}>
          <input type='submit' value = 'Edit' /> 
          </form>)
        }
      })
      const imageAppears = (() =>{
        if (props.note.articleImage != ""){
          return   <div>
                    <img src={`uploads/${props.note.articleImage}`} alt="Girl in a jacket" width="100%" height="auto"/>
                  </div>

        }
      })
return(
  <>

      <article data-cy="note" className='note' key={ props.note._id }>

      {/* <div className="container-2">
         <h2 className="post-author con-2-1">{ props.note.noteAuthor }</h2>
      </div> */}

        <div className="con-1-2">
            <h6 className="post-date">{ date }</h6>
      </div>

        <div className="container-4">
          <p className='message con-4-1'>{ props.note.title }</p>
       </div>

       <div className="container-4">

              {imageAppears()}
      </div>

       <div className="container-4">
          <p className='message con-4-1'>{ props.note.noteContent }</p>
       </div>

        <div className="container-4">
          <h6>tags:</h6>
          {/* <p className='message con-4-1'>{ props.note.tags }</p> */}
          <p className='message con-4-1'>
            { props.note.tags.map(
              (tag) => (tag.name)).join(', ')}</p>
       </div>
       
       <div className='row d-flex mw-100 p-0 m-0'>
        <div className='col p-0'>
         {deleteBtnAppears()}
        </div>

        <div className='col p-0 m-0 edit-btn text-end'>
          {editLinkAppears()} 
        </div>      
       </div>


      </article>
      </>
)
}

export default Note;
