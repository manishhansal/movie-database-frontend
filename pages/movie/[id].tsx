import React from 'react';
import { useRouter } from 'next/router';
import { movies } from '../../utils/constants';

const MovieDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const movie = movies.find((m) => String(m.id) === String(id));

  if (!movie) {
    return (
      <div className="movies-empty-container">
        <div className="movies-empty-content">
          <div className="movies-empty-title">Movie not found</div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/edit-movie?id=${movie.id}`);
  };

  const handleDelete = () => {
    // TODO: Implement real delete logic
    alert('Movie deleted (placeholder)');
    router.push('/movies');
  };

  return (
    <div className="movie-details-container">
      <div className="movie-details-card">
        <img src={movie.image} alt={movie.title} className="movie-details-image" />
        <div className="movie-details-info">
          <h1 className="movie-details-title">{movie.title}</h1>
          <div className="movie-details-year">{movie.year}</div>
          <div className="movie-details-actions">
            <button className="add-movie-cancel" onClick={handleEdit}>Edit</button>
            <button className="add-movie-submit" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage; 