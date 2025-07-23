import React from 'react';
import { useAuth } from '../context/AuthContext';

const HeaderSection = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Medical Coding AI</h1>
      {user && (
        <div>
          <span className="mr-4">Welcome, {user.email}</span>
          <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default HeaderSection;