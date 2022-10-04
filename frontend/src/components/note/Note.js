import React, { useState } from 'react';
import './Note.css'



const Note = (props) => {

  //const [comment, setComment] = useState();
  //const [showCommentForm, setShowCommentForm] = useState(false);

  const date = new Date(props.note.datePosted).toLocaleDateString("en-uk", {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "short",
      weekday: "long",
      day: "numeric",
      }); 

return(
      <article data-cy="note" className='note' key={ props.note._id }>

      {/* <div className="container-2">
         <h2 className="post-author con-2-1">{ props.note.noteAuthor }</h2>
      </div> */}

        <div className="con-1-2">
            <h2 className="post-date">{ date }</h2>
      </div>

        <div className="container-4">
          <p className='message con-4-1'>{ props.note.noteContent }</p>
       </div>

      </article>
)
}

export default Note;
