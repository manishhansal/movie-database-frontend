import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMovieDetails, deleteMovie, Movie } from '../../api/movies';
import { toast } from 'react-toastify';
import { PLACEHOLDER_IMAGE } from '@/utils/constants';

const MovieDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetails(id as string)
      .then((data) => setMovie(data.movie))
      .catch((err) => setError(err.message || 'Failed to fetch movie'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    if (!movie) return;
    router.push(`/edit-movie?id=${movie.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!movie) return;
    setDeleting(true);
    try {
      await deleteMovie(movie.id!);
      toast.success('Movie deleted');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className="movies-empty-container"><div className="movies-empty-title">Loading movie...</div></div>;
  }
  if (error || !movie) {
    return (
      <div className="movies-empty-container">
        <div className="movies-empty-content">
          <div className="movies-empty-title">{error || 'Movie not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      <button className="movie-back-btn" onClick={() => router.push('/')}>{'< Back'}</button>
      <div className="movie-details-card">
        <img src={movie.moviePoster || PLACEHOLDER_IMAGE} alt={movie.movieName} className="movie-details-image" />
        <div className="movie-details-info">
          <h1 className="movie-details-title">{movie.movieName}</h1>
          <div className="movie-details-year">Release Date : {movie.yearOfPublished}</div>
          <div className="movie-details-descr">Description : {movie.movieDes}</div>
          <div className="movie-details-actions">
            <button className="add-movie-cancel" onClick={handleEdit}>Edit</button>
            <button className="add-movie-submit" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Delete Movie</div>
            <div className="modal-message">Are you sure you want to delete this movie?</div>
            <div className="modal-actions">
              <button className="movie-delete-btn" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
              <button className="movie-edit-btn" onClick={cancelDelete} disabled={deleting}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage; 