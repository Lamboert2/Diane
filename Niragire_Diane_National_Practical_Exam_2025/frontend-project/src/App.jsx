import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Routing from './Routing';
import Header from './Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername || "");
  }, []);

  const hideHeaderRoutes = ['/', '/register'];
  const shouldShowLayout = isLoggedIn && !hideHeaderRoutes.includes(location.pathname);

  if (!shouldShowLayout) return <Routing />;

  return (
    <div className="flex h-screen">
      <aside className="w-44 bg-black text-white">
        <Header />
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">
          Welcome | <span className="text-green-600">{username}</span>
        </h1>
        <Routing />
      </main>
    </div>
  );
}

export default App;
