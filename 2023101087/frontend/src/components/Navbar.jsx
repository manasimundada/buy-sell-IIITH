import { Link } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/auth';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/search-items">Search Items</Link></li>
        <li><Link to="/my-items">My Items</Link></li>
        <li><Link to="/order-history">Order History</Link></li>
        <li><Link to="/deliver-items">Deliver Items</Link></li>
        <li><Link to="/my-cart">My Cart</Link></li>
        <li><Link to="/support">Support</Link></li>
        {isAuthenticated() ? (
          <li><button onClick={logout} style={{ cursor: 'pointer', background: 'red', color: 'white' }}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
