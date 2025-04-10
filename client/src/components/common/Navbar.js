// client/src/components/common/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                Fuel Delivery Platform
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;