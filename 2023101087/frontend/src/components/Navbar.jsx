import { Link } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/auth';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Home</Link>
      {isAuthenticated() ? (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={logout} style={{ cursor: 'pointer', background: 'red', color: 'white' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
