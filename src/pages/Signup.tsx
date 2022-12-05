// React & React Router Modules
import React from 'react';
import { NavLink } from 'react-router-dom';

/* "Signup" Component - signup page for user creation */
export default function Signup() {
  //Regular login using JWTs without OAuth  
  const registerAccount = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Registration Submitted')
    const email = e.target.email.value;
    const password = e.target.password.value;

  }

  return (
    <div className='grid h-80 place-items-center'>
      <div>
        <h3>Register with dbSpy:</h3>
        <form onSubmit={(e) => registerAccount(e)}>
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
