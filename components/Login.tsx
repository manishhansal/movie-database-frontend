import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { loginApi } from '../api/auth';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  remember: Yup.boolean(),
});

const Login: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <h1 className="login-title">Sign in</h1>
      <Formik
        initialValues={{ email: '', password: '', remember: false }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            const res = await loginApi({ email: values.email, password: values.password });
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            router.push('/');
          } catch (err: any) {
            toast.error(err.message || 'Login failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <Field type="email" name="email" placeholder="Email" className="login-input" />
            <ErrorMessage name="email" component="div" className="login-error" />

            <Field type="password" name="password" placeholder="Password" className="login-input" />
            <ErrorMessage name="password" component="div" className="login-error" />

            <label className="login-remember">
              <Field type="checkbox" name="remember" /> Remember me
            </label>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <div className="login-signup-row">
        <span className="login-signup-label">New user?</span>
        <button
          type="button"
          className="login-signup-btn"
          onClick={() => router.push('/signup')}
        >
          Sign up
        </button>
      </div>
    </>
  );
};

export default Login; 