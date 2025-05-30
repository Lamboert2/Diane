import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate('/');
  };

  return (
    <nav className="h-full p-6 flex flex-col justify-between">
      <div className="space-y-4">
        <Link to="/sparepart" className="block text-white hover:text-green-300">Spare Parts</Link>
        <Link to="/stockin" className="block text-white hover:text-green-300">Stock In</Link>
        <Link to="/stockout" className="block text-white hover:text-green-300">Stock Out</Link>
        <Link to="/report" className="block text-white hover:text-green-300">Reports</Link>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-700 text-white py-2 rounded-full"
      >
        Logout
      </button>
    </nav>
  );
}

export default Header;
