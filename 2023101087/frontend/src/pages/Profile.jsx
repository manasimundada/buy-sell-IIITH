import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout, isTokenValid, refreshToken } from '../services/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = localStorage.getItem('token');
        console.log('Token before validation:', token);
        if (!token || !(await isTokenValid())) {
          console.log('Token invalid, attempting to refresh');
          // await handleTokenExpiration(navigate);
          return;
        }
    
        console.log('Token after validation/refresh:', token);
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('hello');
        console.log('Profile fetch response:', response);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // alert('Session expired, please login again.');
        // logout();
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/auth/profile', editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
      setUser({ ...user, ...editFormData });
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Page</h2>
      {user ? (
        <div>
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <input name="firstName" defaultValue={user.firstName} onChange={handleEditChange} required />
              <input name="lastName" defaultValue={user.lastName} onChange={handleEditChange} required />
              <input name="email" type="email" defaultValue={user.email} onChange={handleEditChange} required />
              <input name="age" type="number" defaultValue={user.age} onChange={handleEditChange} required />
              <input name="contactNumber" defaultValue={user.contactNumber} onChange={handleEditChange} required />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Contact:</strong> {user.contactNumber}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={logout} style={{ background: 'red', color: 'white', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
