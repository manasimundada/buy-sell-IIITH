import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../services/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');  // Redirect to login if no token
          return;
        }

        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Session expired, please login again.');
        logout();
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Page</h2>
      {user ? (
        <div>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Contact:</strong> {user.contactNumber}</p>
          <button onClick={logout} style={{ background: 'red', color: 'white', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
