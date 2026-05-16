import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import AuthHeader from '../components/auth/AuthHeader';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col theme-transition bg-[var(--background)]">
      <AuthHeader />
      <div className="auth-page flex-1 flex flex-col">
        <div className="auth-page-inner flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
          <div className="max-w-md w-full page-content-enter">
            <div className="auth-panel">
              <div className="auth-panel-edge" aria-hidden />
              <div className="auth-panel-body">
                <LoginForm />
                <p className="mt-8 pt-6 text-center text-sm auth-form-footer">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
