import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getExpense } from '../redux/features/expense/expense.reducer';
import { getUserId } from '../utils/Utils';
import { getIncome, getIncomeLastDate } from '../redux/features/income/income.reducer';
import { createGoal, editGoal, getGoal } from '../redux/features/goal.reducer';
import { data } from 'autoprefixer';
import { useNavigate, useParams } from 'react-router-dom';
import { clearState, clearSuccess } from '../redux/features/goal.slice';
import GoalModal from '../components/GoalModal';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
  percentage: Yup.number()
    .required('Percentage is required')
    .min(0, 'Percentage must be a positive number'),
});

function EditGoal() {
  const router = useParams();
  const [initialValues, setInitialValues] = useState('');
  const [tempPer, setTempPer] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const UserId = getUserId();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { goal, isLoading, isSuccess, isError, status, haveNotified } = useSelector(
    (state) => state.goal
  );
  const { incomes } = useSelector((state) => state.income);
  const { expenses } = useSelector((state) => state.expense);
  const [monthlySaving, setMonthlySaving] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function calculateMonthsToGoal(monthlyIncome, priceOfGoal, savingsPercentage, monthlyExpense) {
    // const savedAmount = monthlyIncome - monthlyExpense;

    const totalMonthlySavings = (monthlyIncome * savingsPercentage) / 100;
    if (savingsPercentage < 10 || savingsPercentage > 50) {
      return setErrorMessage('Invalid savings percentage. Must be between 10 and 50.');
    } else if (savingsPercentage > 30) {
      setErrorMessage('');
      if (savingsPercentage != tempPer) {
        setModalOpen(true);
      }
    } else if (totalMonthlySavings > monthlyIncome) {
      return setErrorMessage('Monthly savings exceed monthly income. Please review your finances.');
    }

    setTempPer(savingsPercentage);

    setErrorMessage('');
    setMonthlySaving(totalMonthlySavings);
    // debugger
    // Calculate total savings needed
    const monthsNeeded = Math.ceil(priceOfGoal / totalMonthlySavings);
    // Calculate months needed

    return monthsNeeded;
    // }
  }
  const [monthsToGoal, setMonthsToGoal] = useState('');
  useEffect(() => {
    // setLoader(true)
    Promise.all([
      dispatch(getIncome(UserId)),
      dispatch(getIncomeLastDate(UserId)),
      dispatch(getExpense(UserId)),
      dispatch(getGoal(UserId)),
    ]).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [dispatch, UserId]);
  useEffect(() => {
    const res = goal?.filter((item) => item?._id === router.id);
    setInitialValues(res);
  }, [router.id, goal]);
  useEffect(() => {
    if (isError) {
      clearState();
    }
    return () => {
      dispatch(clearSuccess());
    };
  }, [isError, dispatch]);
  useEffect(() => {
    if (status === 'completed' && !haveNotified) {
      setModalOpen2(true);
      dispatch(editGoal({ haveNotified: true }));
    }
  }, [status]);
  return (
    <div className="flex h-screen overflow-hidden">
      <GoalModal
        text="The reccommended amount of savings is usually between 20-25%"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
      <GoalModal
        text="Your Goal is Completed "
        modalOpen={modalOpen2}
        setModalOpen={setModalOpen2}
      />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-5">
              <div class="w-full lg:w-[60%]">
                <div class="flex flex-row bg-white shadow-sm rounded p-4">
                  <div class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500">
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v14m-6-7h12"
                      ></path>
                      <circle cx="6" cy="12" r="2" fill="currentColor"></circle>
                      <circle cx="18" cy="12" r="2" fill="currentColor"></circle>
                    </svg>
                  </div>

                  <div class="flex flex-col flex-grow ml-4">
                    <div class="font-bold text-lg mt-2">
                      <span id="yearly-cost-result">{`It will take ${
                        monthsToGoal !== undefined ? monthsToGoal : 0
                      } month to reach your goal`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full lg:w-[60%] bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 p-5">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Setting Your Goals
                </h1>
                <Formik
                  enableReinitialize
                  initialValues={{
                    name: initialValues[0]?.name,
                    price: initialValues[0]?.price,
                    percentage: initialValues[0]?.percentage,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    debugger
                    let data = {
                      UserId: UserId,
                      name: values.name,
                      price: values.price,
                      percentage: values.percentage,
                      timeto_take: monthsToGoal,
                      monthly_saving: monthlySaving,
                      haveNotified: false,
                    };
                    dispatch(editGoal(data));
                    // navigate('/');
                  }}
                >
                  {({ values }) => {
                    // if (values.percentage !== tempPer) {

                    const monthsToGoal = calculateMonthsToGoal(
                      incomes[0]?.total_income,
                      values?.price,
                      values?.percentage,
                      expenses[0]?.total_expense
                    );
                    setMonthsToGoal(monthsToGoal);
                    // }

                    return (
                      <>
                        <Form className="mt-5">
                          <div className="mb-5">
                            <label
                              className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
                              htmlFor="name"
                            >
                              Total Income
                            </label>
                            <input
                              name="username"
                              value={incomes[0]?.total_income}
                              type="text"
                              disabled={true}
                              autocomplete="off"
                              placeholder="Enter your Username"
                              className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
                            />
                          </div>
                          <div className="mb-5">
                            <label
                              className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
                              htmlFor="name"
                            >
                              Total Expense
                            </label>
                            <input
                              name="username"
                              value={expenses[0]?.total_expense}
                              type="text"
                              disabled={true}
                              autocomplete="off"
                              className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
                            />
                          </div>
                          <div className="mb-5">
                            <label
                              className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
                              htmlFor="name"
                            >
                              Name
                            </label>
                            <Field
                              type="text"
                              name="name"
                              className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-sm font-medium text-red-600"
                            />
                          </div>
                          <div className="mb-5">
                            <label
                              className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
                              htmlFor="price"
                            >
                              Price
                            </label>
                            <Field
                              type="number"
                              name="price"
                              className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
                            />
                            <ErrorMessage
                              name="price"
                              component="div"
                              className="text-sm font-medium text-red-600"
                            />
                          </div>
                          <div className="mb-5">
                            <label
                              className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
                              htmlFor="percentage"
                            >
                              Percentage
                            </label>
                            <Field
                              type="number"
                              name="percentage"
                              className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
                            />
                            <ErrorMessage
                              name="percentage"
                              component="div"
                              className="text-sm font-medium text-red-600"
                            />
                            {errorMessage && (
                              <label
                                className="block text-sm font-bold mb-1 text-red-600"
                                htmlFor="errorMessage"
                              >
                                {errorMessage}
                              </label>
                            )}
                          </div>
                          <button
                            type="submit"
                            className={`${
                              errorMessage || values.percentage < 0 || values.percentage > 100
                                ? 'bg-[#cac7ff] text-white px-6 py-2 text-sm font-medium rounded-md cursor-not-allowed'
                                : 'bg-[#4F46E5] hover:bg-[#433BCB] text-white px-6 py-2 text-sm font-medium rounded-md'
                            }`}
                            disabled={errorMessage != ''}
                          >
                            Submit
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditGoal;
