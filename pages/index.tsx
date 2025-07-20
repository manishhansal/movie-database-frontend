import React, { useEffect, useState } from 'react';
import MoviePage from '../components/MoviePage';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="movies-container">
      <header className="movies-header">
        <h1 className="movies-title">Dashboard{userName ? ` — Welcome, ${userName}` : ''}</h1>
        <div className="movies-header-actions">
          <button className="add-movie-btn" onClick={() => router.push('/add-movie')}>Add New Movie</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <MoviePage />
    </div>
  );
};

export default Dashboard;
