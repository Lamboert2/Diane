import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MemberRegister() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleAdd = () => {
    const { username, password } = formData;
    if (!username || !password) {
      setMessage("All fields are required");
    } else {
      axios.post("http://localhost:7392/createmember", formData)
        .then((result) => {
          if (result.data.message === "Username Alredy Taken") {
            setMessage(result.data.message);
          } else {
            setMessage("Member added successfully");
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <h2 className="text-center text-2xl font-semibold mb-4">Member Registration</h2>

        {message && (
          <p className={`text-center text-sm mb-4 ${message === "Member added successfully" ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">Username</label>
            <input
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default MemberRegister;
