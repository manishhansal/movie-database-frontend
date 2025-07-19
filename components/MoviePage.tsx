import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { movies } from '../utils/constants';

const MOVIES_PER_PAGE = 8;

const MoviePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  const startIdx = (currentPage - 1) * MOVIES_PER_PAGE;
  const currentMovies = movies.slice(startIdx, startIdx + MOVIES_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/movie/${id}`);
  };

  if (movies.length === 0) {
    return (
      <div className="movies-empty-container">
        <div className="movies-empty-content">
          <div className="movies-empty-title">Your movie list is empty</div>
          <button className="add-movie-btn">Add a new movie</button>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-container">
      <header className="movies-header">
        <h1 className="movies-title">My movies <span role="img" aria-label="smile">☺️</span></h1>
        {/* <div className="movies-header-actions">
          <button className="logout-btn">Logout</button>
        </div> */}
      </header>
      <div className="movies-grid">
        {currentMovies.map((movie: any) => (
          <div className="movie-card" key={movie.id} onClick={() => handleCardClick(movie.id)} style={{ cursor: 'pointer' }}>
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-info">
              <div className="movie-title">{movie.title}</div>
              <div className="movie-year">{movie.year}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="movies-pagination">
        <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`pagination-btn${currentPage === i + 1 ? ' pagination-current' : ''}`}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
        <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default MoviePage; 