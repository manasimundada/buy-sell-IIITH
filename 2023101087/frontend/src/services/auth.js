import axios from 'axios';

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const isTokenValid = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axios.get('http://localhost:3000/api/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Token validation response:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/refresh-token', {
      token: localStorage.getItem('token'),
    });
    console.log('Token refresh response:', response);
    localStorage.setItem('token', response.data.token);
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

export const handleTokenExpiration = async (navigate) => {
  if (!(await refreshToken())) {
    alert('Session expired, please login again.');
    logout();
    navigate('/login');
  }
};
