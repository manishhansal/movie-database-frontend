import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { signupApi } from '../api/auth';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  profile: Yup.mixed(),
});

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="add-movie-container">
      <h1 className="add-movie-title">Sign up</h1>
      <Formik
        initialValues={{ name: '', email: '', password: '', profile: null }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          try {
            await signupApi({
              name: values.name,
              email: values.email,
              password: values.password,
              profilePic: '',
            });
            toast.success('Signup successful! Please login.');
            router.push('/login');
          } catch (err: any) {
            toast.error(err.message || 'Signup failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="add-movie-form">
            <div className="add-movie-dropzone" onClick={() => fileInputRef.current?.click()}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile Preview" className="add-movie-image-preview" />
              ) : (
                <div className="add-movie-dropzone-placeholder">
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>⭳</span>
                  Drop profile picture here
                </div>
              )}
              <Field name="profile">
                {({ form }: any) => (
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      form.setFieldValue('profile', file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setProfilePreview(e.target?.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setProfilePreview(null);
                      }
                    }}
                  />
                )}
              </Field>
            </div>
            <div className="add-movie-fields">
              <Field name="name" placeholder="Name" className="login-input add-movie-input" />
              <ErrorMessage name="name" component="div" className="login-error" />
              <Field name="email" placeholder="Email" className="login-input add-movie-input" />
              <ErrorMessage name="email" component="div" className="login-error" />
              <Field name="password" type="password" placeholder="Password" className="login-input add-movie-input" />
              <ErrorMessage name="password" component="div" className="login-error" />
              <div className="add-movie-actions">
                <button type="button" className="add-movie-cancel" onClick={() => router.push('/login')}>Cancel</button>
                <button type="submit" className="add-movie-submit" disabled={isSubmitting}>Sign up</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupPage; 