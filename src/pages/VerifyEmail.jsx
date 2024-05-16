import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { emailVerification } from '../redux/features/auth/auth.reducer';
import { useParams } from 'react-router-dom';

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  console.log(token);
  useEffect(() => {
    dispatch(emailVerification(token));
  }, [token]);
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
      <div className="max-w-xl px-5 text-center">
        <h6 className="mb-2 text-[42px] font-bold text-zinc-800">
          Congraturaltions! Your email has been verified
        </h6>
        <a
          href="/login"
          className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
