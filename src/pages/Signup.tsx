// React & React Router Modules
import axios from 'axios';
import React from 'react';
import { NavLink } from 'react-router-dom';

/* "Signup" Component - signup page for user creation */
export default function Signup() {
  //Regular login using JWTs without OAuth  
  const registerAccount = async (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Registration Submitted')
    const full_name = `${e.target.firstName.value} ${e.target.lastName.value}`;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userAcc = { full_name, email, password};
    await axios.post('/api/userRegistration', userAcc)
  }

  return (
    <div className='grid h-80 place-items-center'>
      <div>
        <h3>Register with dbSpy:</h3>
        <form onSubmit={(e) => registerAccount(e)}>
        <input type='firstName' name="firstName" placeholder='William' required></input>
        <input type='lastName' name="lastName" placeholder='Sentance' required></input>
          <input type='email' name="email" placeholder='Email' required></input>
          <input type='password' name="password" placeholder='Password' required></input>
          <input type='submit'></input>
        </form>
      </div>
      <span>
        Already have an account?
        <NavLink to='/login'>Login</NavLink>
      </span>
    </div>
  );
}
