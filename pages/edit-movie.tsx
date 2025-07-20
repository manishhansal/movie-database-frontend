import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getMovieDetails, editMovie, Movie } from '../api/movies';
import { toast } from 'react-toastify';

const EditMovieSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  year: Yup.number().typeError('Year must be a number').required('Publishing year is required'),
  description: Yup.string(),
  // No image validation
});

const EditMoviePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialMovie, setInitialMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetails(id as string)
      .then((data) => {
        setInitialMovie(data.movie);
        setImagePreview(data.movie.moviePoster || null);
      })
      .catch((err) => setError(err.message || 'Failed to fetch movie'))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return <div className="movies-empty-container"><div className="movies-empty-title">Invalid movie ID.</div></div>;
  }
  if (loading) {
    return <div className="movies-empty-container"><div className="movies-empty-title">Loading movie...</div></div>;
  }
  if (error || !initialMovie) {
    return <div className="movies-empty-container"><div className="movies-empty-title">{error || 'Movie not found'}</div></div>;
  }

  return (
    <div className="add-movie-container">
      <h1 className="add-movie-title">Edit</h1>
      <Formik
        enableReinitialize
        initialValues={{
          title: initialMovie.movieName || '',
          year: initialMovie.yearOfPublished ? Number(initialMovie.yearOfPublished) : '',
          description: initialMovie.movieDes || '',
        }}
        validationSchema={EditMovieSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (!id) {
            toast.error('Invalid movie ID');
            setSubmitting(false);
            return;
          }
          setSubmitting(true);
          try {
            await editMovie(id as string, {
              movieName: values.title,
              yearOfPublished: Number(values.year),
              movieDes: values.description,
              // moviePoster: '', // Not sending image to API
            });
            toast.success('Movie updated');
            router.push('/');
          } catch (err: any) {
            toast.error(err.message || 'Update failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, isSubmitting, errors }) => (
          <Form className="add-movie-form">
            <div className="add-movie-dropzone" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="add-movie-image-preview" />
              ) : (
                <div className="add-movie-dropzone-placeholder">
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>⭳</span>
                  Drop other image here (optional)
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setImagePreview(e.target?.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setImagePreview(null);
                  }
                }}
              />
            </div>
            <div className="add-movie-fields">
              <Field name="title" placeholder="Title" className="login-input add-movie-input" />
              <ErrorMessage name="title" component="div" className="login-error" />
              <Field name="year" placeholder="Publishing year" className="login-input add-movie-input" />
              <ErrorMessage name="year" component="div" className="login-error" />
              <Field name="description" placeholder="Description" className="login-input add-movie-input" />
              <ErrorMessage name="description" component="div" className="login-error" />
              <div className="add-movie-actions">
                <button type="button" className="add-movie-cancel" onClick={() => router.push('/')}>Cancel</button>
                <button type="submit" className="add-movie-submit">Update</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditMoviePage; 