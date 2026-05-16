import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import AuthHeader from '../components/auth/AuthHeader';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col theme-transition bg-[var(--background)]">
      <AuthHeader />
      <div className="auth-page flex-1">
        <div className="auth-page-inner max-w-4xl mx-auto px-4 w-full py-10 sm:py-14">
          <div className="auth-panel page-content-enter">
            <div className="auth-panel-edge" aria-hidden />
            <div className="auth-panel-body">
              <RegisterForm />
              <p className="mt-10 pt-8 text-center text-sm auth-form-footer">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
