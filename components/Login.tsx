import React from 'react';
import Layout from './Layout';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  remember: Yup.boolean(),
});

const Login: React.FC = () => {
  return (
    <>
      <h1 className="login-title">Sign in</h1>
      <Formik
        initialValues={{ email: '', password: '', remember: false }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          // TODO: Handle form submission
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
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
    </>
  );
};

export default Login; 