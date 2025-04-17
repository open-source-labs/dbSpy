import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
import { config } from 'dotenv';

config();

const GitHubCallback: React.FC = () => {
  const apiOauth = process.env.PROD_API_OAUTH || 'http://localhost:8080/api/oauth';
  const setUser = useCredentialsStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const state = new URLSearchParams(window.location.search).get('state');
    console.log('Code + State from GitHub:', code, state); // Log to check the value of code and state

    if (!code) {
      navigate('/login');
      return;
    }

    fetch(apiOauth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state, type: 'GITHUB' }),
      credentials: 'include', // important for cookies/sessions
    })
      .then((res) => res.json())
      .then((user) => {
        if (user) {
          setUser(user); // sets the Zustand user state
          navigate('/display');
        } else {
          navigate('/login');
        }
      })
      .catch((err) => {
        console.error('OAuth error:', err);
        navigate('/login');
      });
  }, []);

  // For future iterations, can add in a loading state for GitHub login while it's processing and user data is set in credential store
  // Right now there's no loading screen, but it doesn't take too long when users click 'Continue with GitHub' and going to the /display page
  return null;
};

export default GitHubCallback;
