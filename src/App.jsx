
import './App.css'
import React, { useEffect, useState, useMemo } from 'react';  
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  console.log(CLIENT_ID)
  const REDIRECT_URI = 'http://localhost:5173/Spotify/callback';
  const SCOPES = 'user-read-private user-read-email user-top-read'; // Add more scopes as needed 
  const token = localStorage.getItem('spotifyToken');

  const AUTH_URL = useMemo(() => {
    return `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  }, [CLIENT_ID, REDIRECT_URI, SCOPES]);

  const [userData, setUserData] = useState(null);

  const handleLogin = () => {
    window.location.href = AUTH_URL; // Redirect to Spotify login
  };

  
  const fetchUserData  = async() => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUserData(data); // Update state with the fetched data
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect (() => {
    fetchUserData();
  }, []);

  if(token){
    if(userData){
      return (
        <div className="container">
        <header className="header">
          <h1>Spotify App</h1>
          <div className="account-info">
          {userData.images && userData.images[0] && (
              <img
                src={userData.images[0].url}
                alt="User Profile"
                className="account-icon"
              />
            )}
          <button onClick={() => navigate('/Spotify/AccountInfo')} className="auth-button">
            Account Info
          </button>
          </div>
        </header>
        <div className='container'>
          <button className='artist-page' onClick={() => navigate('/Spotify/FavoriteArtists')}>
          Top Artists Page
          </button>
          
          <button className='track-page' onClick={() => navigate('/Spotify/FavoriteTracks')} >
            Top Tracks Page
          </button>
          </div>
      </div>
    );
    }
  }
  return (
    <div className="container">
      <header className="header">
        <h1>Spotify App</h1>
        <button onClick={handleLogin} className="auth-button">
          Login with Spotify
        </button>
      </header>
    </div>
  );


};

export default App;

