import React, { useEffect } from 'react'
import Profile from '../components/profile/Profile';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/register");
  }, [navigate]);

  return <Profile />;
}

export default ProfilePage