import React, { useState } from 'react';


const SignUpForm = ({ navigate }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [img, setImage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const regEx = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    if (regEx.test(email)){
      fetch( '/users', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password, username: username, img: img})
      })
        .then(response => {
          if(response.status === 201) {
            navigate('/login')
          } else {
            navigate('/signup')
          }
        })
    } else if(!regEx.test(email) && email !== ""){
      alert("The given email is not correctly formatted - please try again.")
      return;
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleImgChange = (event) => {
    setImage(event.target.value)
  }

    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Create an account</h3>
            <div className="text-center">
              Already registered?{" "}
              <a className="link-primary" href="/login">
                Sign In
              </a>
            </div>
            <div className="form-group mt-3">
              <label>Full Name</label>
              <input
                id="username"
                value={ username } 
                onChange={handleUsernameChange}
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane Doe" required
              />
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                id="email"
                value={ email } 
                onChange={handleEmailChange}
                type="email"
                className="form-control mt-1"
                placeholder="Email Address" required
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                id="password"
                value={ password } 
                onChange={handlePasswordChange} minLength="7" required
                type="password"
                className="form-control mt-1"
                placeholder="Password"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

    );
}

export default SignUpForm;
