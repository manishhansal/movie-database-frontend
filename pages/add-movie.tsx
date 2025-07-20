import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createMovie } from '../api/movies';
import { toast } from 'react-toastify';

const AddMovieSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  year: Yup.number().typeError('Year must be a number').required('Publishing year is required'),
  description: Yup.string(),
  // No image validation
});

const AddMoviePage: React.FC = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="add-movie-container">
      <h1 className="add-movie-title">Create a new movie</h1>
      <Formik
        initialValues={{ title: '', year: '', description: '' }}
        validationSchema={AddMovieSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            await createMovie({
              movieName: values.title,
              yearOfPublished: Number(values.year),
              movieDes: values.description,
              // moviePoster: '', // Not sending image to API
            });
            toast.success('Movie created');
            router.push('/');
          } catch (err: any) {
            toast.error(err.message || 'Create movie failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="add-movie-form">
            <div className="add-movie-dropzone" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="add-movie-image-preview" />
              ) : (
                <div className="add-movie-dropzone-placeholder">
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>⭳</span>
                  Drop an image here (optional)
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
                <button type="submit" className="add-movie-submit" disabled={isSubmitting}>Submit</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMoviePage; 