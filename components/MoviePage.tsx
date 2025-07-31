import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllMovies, deleteMovie, Movie } from '../api/movies';
import { toast } from 'react-toastify';
import { MOVIES_PER_PAGE, PLACEHOLDER_IMAGE } from '@/utils/constants';

function highlight(text: string, term: string) {
  if (!term) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
  );
}

const MoviePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchMovies = () => {
    setLoading(true);
    setError(null);
    getAllMovies(currentPage, MOVIES_PER_PAGE, debouncedSearch)
      .then((data) => {
        setMovies(data.movies || data.data || []);
        setTotalPages(data.totalPages || data.total || 1);
        setTotalResults(data.totalResults || data.count || (data.movies ? data.movies.length : 0));
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch movies');
        toast.error(err.message || 'Failed to fetch movies');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line
  }, [currentPage, debouncedSearch]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/movie/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-movie?id=${id}`);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deleteMovie(pendingDeleteId);
      toast.success('Movie deleted');
      setPendingDeleteId(null);
      fetchMovies();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="movies-empty-container"><div className="movies-empty-title">Loading movies...</div></div>;
    }
    if (error) {
      return <div className="movies-empty-container"><div className="movies-empty-title">{error}</div></div>;
    }
    if (movies.length > 0) {
      return (
        <>
          <div className="movies-results-count">{totalResults} result{totalResults !== 1 ? 's' : ''} found</div>
          <div className="movies-grid">
            {movies.map((movie: any) => (
              <div
                className="movie-card"
                key={movie.id}
                style={{ cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => setHoveredCardId(movie.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <img
                  src={movie.moviePoster || PLACEHOLDER_IMAGE}
                  alt={movie.movieName}
                  className="movie-image"
                  onClick={() => handleCardClick(movie.id)}
                />
                <div className="movie-info" onClick={() => handleCardClick(movie.id)}>
                  <div className="movie-title">{highlight(movie.movieName, debouncedSearch)}</div>
                  <div className="movie-year">{movie.yearOfPublished}</div>
                  <div className="movie-descr">{highlight(movie.movieDes || '', debouncedSearch)}</div>
                </div>
                {hoveredCardId === movie.id && (
                  <div className="movie-card-actions">
                    <button className="movie-edit-btn" onClick={e => { e.stopPropagation(); handleEdit(movie.id); }}>Edit</button>
                    <button className="movie-delete-btn" onClick={e => { e.stopPropagation(); handleDelete(movie.id); }}>Delete</button>
                  </div>
                )}
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
        </>
      );
    }
    if (debouncedSearch) {
      return (
        <div className="movies-empty-container">
          <div className="movies-empty-title">No movies found for "{debouncedSearch}".</div>
        </div>
      );
    }
    return (
      <div className="movies-empty-container">
        <div className="movies-empty-content">
          <div className="movies-empty-title">Your movie list is empty</div>
          <button className="add-movie-btn" onClick={() => router.push('/add-movie')}>Add a new movie</button>
        </div>
      </div>
    );
  };

  return (
    <div className="movies-container">
      <header className="movies-header">
        <h1 className="movies-title">My movies <span role="img" aria-label="smile">☺️</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            className="movies-search-input"
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 220, maxWidth: 320 }}
          />
          {search && (
            <button className="movies-search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>
      </header>

      {renderContent()}

      {/* Custom Delete Confirmation Modal */}
      {pendingDeleteId && (
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

export default MoviePage; 