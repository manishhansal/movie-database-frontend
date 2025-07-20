const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000';

export type Movie = {
  id?: string;
  movieName: string;
  movieDes: string;
  yearOfPublished: number;
  moviePoster?: string;
};

export async function createMovie(movie: Movie): Promise<Movie> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(movie),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Create movie failed');
  }
  return res.json();
}

export async function getAllMovies(page = 1, limit = 8, search = ''): Promise<any> {
  const token = localStorage.getItem('token');
  let url = `${BASE_URL}/movies?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Get movies failed');
  }
  return res.json();
}

export async function getMovieDetails(id: string): Promise<any> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Get movie details failed');
  }
  return res.json();
}

export async function editMovie(id: string, movie: Movie): Promise<Movie> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(movie),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Edit movie failed');
  }
  return res.json();
}

export async function deleteMovie(id: string): Promise<{ message: string }> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Delete movie failed');
  }
  return res.json();
} 