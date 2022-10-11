import React, { useState } from 'react';


const LogInForm = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function refreshPage(){ 
    window.location.reload();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = await fetch( '/tokens', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password })
    })

    if(response.status !== 201) {
     alert("The login credentials are not valid. Please try again or sign up if you don't have an account.")
      navigate('/login')
    } else {
      console.log("oop")
      let data = await response.json()
      window.localStorage.setItem("token", data.token)
      navigate('/notes');
    }
    refreshPage()
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }


    return (
      <>

        <div className="Auth-form-container">
              <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                  <h3 className="Auth-form-title">Sign In</h3>
                  <div className="form-group mt-3">
                    <label>Email address</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control mt-1"
                      placeholder="Enter email"
                      value={ email } 
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Password</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control mt-1"
                      placeholder="Enter password"
                      value={ password }
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button type="submit" id="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                  <p className="forgot-password text-right mt-2">
                    Don't have an <a href="/signup">account?</a>
                  </p>
                </div>
              </form>
        </div>

       </>

  );
}

export default LogInForm;
