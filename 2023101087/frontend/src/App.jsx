import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Navbar from './components/Navbar.jsx';
import { isAuthenticated } from './services/auth';
import Home from './pages/Home.jsx';
import SearchItems from './pages/SearchItems.jsx';
import MyItems from './pages/MyItems.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import DeliverItems from './pages/DeliverItems.jsx';
import MyCart from './pages/MyCart.jsx';
import Support from './pages/Support.jsx';

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome to Buy-Sell Platform</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/search-items" element={<ProtectedRoute element={<SearchItems />} />} />
        <Route path="/my-items" element={<ProtectedRoute element={<MyItems />} />} />
        <Route path="/order-history" element={<ProtectedRoute element={<OrderHistory />} />} />
        <Route path="/deliver-items" element={<ProtectedRoute element={<DeliverItems />} />} />
        <Route path="/my-cart" element={<ProtectedRoute element={<MyCart />} />} />
        <Route path="/support" element={<ProtectedRoute element={<Support />} />} />
      </Routes>
    </Router>
  );
}

export default App;
