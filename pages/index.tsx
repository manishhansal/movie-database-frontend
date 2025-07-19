import React from 'react';
import MoviePage from '../components/MoviePage';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: logout logic
    router.push('/login');
  };

  return (
    <div className="movies-container">
      <header className="movies-header">
        <h1 className="movies-title">Dashboard</h1>
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
