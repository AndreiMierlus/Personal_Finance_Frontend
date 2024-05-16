import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../redux/features/auth/auth.reducer';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{ password: '', confirmPassowrd: '' }}
      validate={(values) => {
        const errors = {};
        if (!values.password) {
          errors.password = 'Required';
        }
        if (!values.confirmPassowrd) {
          errors.confirmPassowrd = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          setIsLoading(true);
          let data = {
            token: token,
            password: values.password,
          };
          if (values.password != values.confirmPassowrd) {
            alert('Password not matched');
            setIsLoading(false);
          } else {
            dispatch(resetPassword(data));
            setIsLoading(false);
            actions.resetForm({
              values: {
                password: '',
                confirmPassowrd: '',
              },
            });
            navigate('/login');
          }
        }, 500);
      }}
    >
      {({ values, touched, errors, isSubmitting, handleBlur, handleChange }) => {
        console.log(values, 'valuesss');
        return (
          <Form>
            <div className="h-screen px-2 overflow-hidden w-full bg-[#FAFBFC] relative flex justify-center items-center">
              <div className="flex justify-between items-center px-5 py-6 absolute top-0 w-full">
                <div>
                  <img src="/logo.png" className="w-[140px]" alt="" />
                </div>
              </div>
              <div className="w-[480px] bg-transparent z-50 flex flex-col justify-center items-center">
                <div className="bg-white py-10 px-16 rounded-2xl shade">
                  <h1 className="text-2xl md:text-3xl text-center font-semibold mb-3">
                    Reset Password
                  </h1>
                  <form>
                    <div className="w-full my-3">
                      <label className="text-[11px] font-medium">Password</label>
                      <div className="mt-0.5 relative flex items-center w-full px-3 border-2 border-gray-300 rounded-lg">
                        <svg
                          className="w-4 h-4 absolute text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                          />
                        </svg>
                        <input
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="password"
                          autocomplete="off"
                          placeholder="Enter password"
                          className="w-full py-2 ml-4 text-sm pl-2 !bg-white focus:outline-none border-none"
                        />
                      </div>
                      <lable className="text-[11px] font-medium text-rose-600">
                        {errors.password && touched.password && errors.password}
                      </lable>
                    </div>
                    <div className="w-full my-3">
                      <label className="text-[11px] font-medium">Confirm Password</label>
                      <div className="mt-0.5 relative flex items-center w-full px-3 border-2 border-gray-300 rounded-lg">
                        <svg
                          className="w-4 h-4 absolute text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                          />
                        </svg>
                        <input
                          name="confirmPassowrd"
                          value={values.confirmPassowrd}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="password"
                          autocomplete="off"
                          placeholder="Enter confirm password"
                          className="w-full py-2 ml-4 text-sm pl-2 !bg-white focus:outline-none border-none"
                        />
                      </div>
                      <lable className="text-[11px] font-medium text-rose-600">
                        {errors.confirmPassowrd &&
                          touched.confirmPassowrd &&
                          errors.confirmPassowrd}
                      </lable>
                    </div>
                  </form>
                  <button
                    type="submit"
                    className="text-white bg-[#4F46E5] hover:bg-[#433BCB] rounded-lg text-sm px-4 lg:px-5 py-3 lg:py-3.5 focus:outline-none font-extrabold w-full mt-3 shade mb-3 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          class="mr-3 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span class="font-medium"> Loading... </span>
                      </>
                    ) : (
                      <p>Reset Passwrod</p>
                    )}
                  </button>
                </div>
              </div>
              <div className="bg__img"></div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ResetPassword;
