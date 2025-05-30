import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MemberLogin() {
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

  const handleLogin = () => {
    const { username, password } = formData;
    if (!username || !password) {
      setMessage("All fields are required");
    } else {
      axios.post("http://localhost:7392/login", formData)
        .then((result) => {
          if (result.data.message === "Incorrect Username or password") {
            setMessage(result.data.message);
          } else {
            setMessage("Logged in");
            localStorage.setItem("username", username);
            localStorage.setItem("isLoggedIn", true);
            setTimeout(() => {
              navigate('/sparepart');
            }, 2000);
          }
        })
        .catch(() => {
          setMessage("Login failed, please try again");
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <h2 className="text-center text-2xl font-semibold mb-4">Member Login</h2>

        {message && (
          <p className={`text-center text-sm mb-4 ${message === "Logged in" ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">Username</label>
            <input
              onChange={handleChange}
              value={formData.username}
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
            <input
              onChange={handleChange}
              value={formData.password}
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoComplete="current-password"
            />
            <div className="text-right mt-1">
              <Link to="/" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            onClick={handleLogin}
            type="button"
            className="w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default MemberLogin;
