import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CSS/login.css';

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // For navigation after login

  const  handleSubmit = async (e)=> {
     e.preventDefault()// Prevent page reload
    
    
    try{
      const url ="http://localhost:3000/api/login";
      const response = await fetch(url, {
    
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user),
    })
    const result = await response.json();
    console.log(result.message)

    const {success  , message ,jwtToken,username,email,_id, error}= result;
    

    if(result.success == true){

        console.log(message)
        
        alert(message)
        
        localStorage.setItem('token',jwtToken);
        localStorage.setItem("userId", _id);
        localStorage.setItem("email", email);
        localStorage.setItem('loggedInUser',username);
        window.dispatchEvent(new Event('storage'));
        console.log("Token set in localStorage:", localStorage.getItem('token'));
        
        console.log("Navigating to Home Page");
          
        alert("Navigating to Home Page")
        setTimeout(() => navigate('/home'), 500);

    }else if(result.success == false){
      
      alert(message)
      console.log("Someting Went Wrong ! Try Again")

    }
  } catch (error) {

      alert('An error occurred. Please try again later.');
      
  }

}
  return (
    <div className='container1'>
      <form id='form' onSubmit={handleSubmit} >
        <h2>Login</h2>
        <input 
          type="text"
          value={user.email}
          placeholder='Enter email'
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required 
        />
        <input 
          type="password"
          value={user.password}
          placeholder='Enter Password'
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required 
        />
        <div className="signup-link">
          <label>Not signed up?</label>
          <Link to="/signup"> Sign Up</Link>
        </div>
        <button type='submit' >Login</button>
      </form>
    </div>
  );
}

export default Login;
