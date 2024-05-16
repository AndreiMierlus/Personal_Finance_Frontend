import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ExpenseModal from '../components/ExpenseModal';
import { useDispatch, useSelector } from 'react-redux';
import { createExpense, editExpense, getExpense } from '../redux/features/expense/expense.reducer';
import { getLatestItem, getUserId } from '../utils/Utils';
import { clearState, clearSuccess } from '../redux/features/expense/expense.slice';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import FormDisableComponent from '../components/FormDisableComponent';

const validationSchema = Yup.object().shape({
  monthly_rent: Yup.number()
    .required('Monthly rent is required')
    .min(0, 'Monthly rent must be a positive number'),
  monthly_debts: Yup.number()
    .required('Monthly debts are required')
    .min(0, 'Monthly debts must be a positive number'),
  debts_period: Yup.date()
    .required('Period of debt is required')
    .min(0, 'Period of debt must be a positive number'),
});

function Expenses() {
  const navigate = useNavigate('');
  const { incomeLastDate } = useSelector((state) => state.income);
  const {expenses } = useSelector((state) => state.expense);
  console.log("expesnes===",expenses)
  const [disableForm, setDisableForm] = useState(false);
  const [loader, setLoader] = useState(false);

  const { isLoading, isSuccess, isError } = useSelector((state) => state.expense);
  const UserId = getUserId();
  const dispatch = useDispatch();
  const [total_expense, setTotalExpense] = useState(0);
  const [expense, setAddExpense] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  // Reducer function to calculate the total price
  const totalPriceReducer = (accumulator, currentValue) => accumulator + currentValue.price;
  // Calculate the total price using the reducer
  let totalPrice = expense.reduce(totalPriceReducer, 0);
  useEffect(() => {
    setLoader(true)
    Promise.all([
      dispatch(getExpense(UserId)),
    ]).catch((error) => {
      console.error('Error fetching data:', error);
    }).finally(e=>{setLoader(false)})
  
  }, [dispatch, UserId]);
  useEffect(() => {
    if (isError) {
      dispatch(clearState());
    }

    return () => {
      clearSuccess();
    };
  }, [isError]);
  useEffect(() => {
    // debugger
   if(expenses.length){
    const expenseItem= getLatestItem(expenses)
  
    if (expenseItem.isExpenseUsable) {
      setDisableForm(false);
    } else {
      setDisableForm(true);
    }
   }else{
    setDisableForm(true);
   }
  }, [expenses]);

  return loader?<h1>...Loading</h1>: disableForm?<FormDisableComponent text="Hey , you can not Expense before Income OR can not add again before the month end" /> :  <div className="flex h-screen overflow-hidden">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>

                  <div class="flex flex-col flex-grow ml-4">
                    <div class="text-sm text-gray-500">Monthly Expenses</div>
                    <div class="font-bold text-lg">
                    <span id="yearly-cost-result">{total_expense} RON</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full lg:w-[60%] bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 p-5">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Add Fixed Expense
                </h1>
                <Formik
                  initialValues={{
                    monthly_rent: '',
                    monthly_debts: '1',
                    debts_period: '1',
                    other_expense: '',
                    fixed_expense: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async(values, actions) => {
                    let expensesWithoutId = expense.map(({ _id, ...rest }) => rest);
                      const { monthly_rent, monthly_debts, debts_period, other_expense } = values;
                      let data = {
                        UserId: String(UserId),
                        monthly_rent: monthly_rent,
                        monthly_debts: monthly_debts,
                        debts_period: debts_period,
                        other_expense: expensesWithoutId,
                        total_expense: total_expense,
                        isExpenseUsable:false


                        //fixed_expense: Number(monthly_rent) + Number(monthly_debts),
                      };
                      const res=await dispatch(editExpense(data));
                      console.log("res===",res)
                     if(res?.payload?.statusCode===200){
                      actions.resetForm({
                        values: {
                          // the type of `values` inferred to be Blog
                          monthly_rent: '',
                          monthly_debts: '',
                          debts_period: '',
                          other_expense: '',
                        },
                     })
                     navigate("/")
                    }
                    

                      //   // you can also set the other form states here
                      // });
                  }}
                >
                  {({ values, isSubmitting }) => {
                    setTotalExpense(
                      Number(values.monthly_rent) +
                        Number(totalPrice)
                    );
                    return (
                      <>
                        <Form className="mt-5">
                          <div className="mb-5">
                            <label
                              className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
                              htmlFor="monthlyRent"
                            >
                              Monthly Rent
                            </label>
                            <Field
                              type="number"
                              name="monthly_rent"
                              className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
                            />
                            <ErrorMessage
                              name="monthly_rent"
                              component="div"
                              className="text-sm font-medium text-red-600"
                            />
                          </div>
                        
                        
                        
                          <div className="mb-5 flex justify-end">
                            <div>
                              <svg
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpenseModalOpen(true);
                                }}
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="max-w-2xl mx-auto mb-5">
                            <div className="flex flex-col">
                              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="inline-block min-w-full align-middle">
                                  <div className="overflow-hidden ">
                                    <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                      <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                          <th
                                            scope="col"
                                            className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                          >
                                            Name
                                          </th>

                                          <th
                                            scope="col"
                                            className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                          >
                                            Price
                                          </th>
                                          <th scope="col" className="p-4">
                                            <span className="sr-only">Edit</span>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {expense?.map((item, index) => {
                                          return (
                                            <>
                                              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <td className="py-4 px-6 text-sm font-medium capitalize text-gray-900 whitespace-nowrap dark:text-white">
                                                  {item?.expense_name}
                                                </td>

                                                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                  {`${item?.price}RON`}
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                                                  <svg
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setExpenseModalOpen(true);
                                                    }}
                                                    className="w-6 h-6 text-gray-800 hover:text-[#4F46E5] cursor-pointer dark:text-white ml-2" // Added ml-2 for margin
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                    />
                                                  </svg>
                                                  <svg
                                                    onClick={() => {
                                                      const updatedExpense = expense?.filter(
                                                        (expenseItem) =>
                                                          expenseItem._id !== item._id
                                                      );
                                                      // Update the state with the new array without the deleted item
                                                      setAddExpense(updatedExpense);
                                                    }}
                                                    class="w-6 h-6 ml-2 text-gray-800 hover:text-[#4F46E5] cursor-pointer dark:text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      fill-rule="evenodd"
                                                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                                      clip-rule="evenodd"
                                                    />
                                                  </svg>
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            disabled={expenses?.length === 0}
                            type="submit"
                            className={`text-white ${
                              expenses && expenses.length === 0
                                ? 'bg-[#756fe7]'
                                : 'bg-[#4F46E5] hover:bg-[#433BCB]'
                            }  rounded-lg text-sm px-4 lg:px-5 py-3 lg:py-3.5 focus:outline-none font-extrabold w-full mt-3 shade mb-3 flex items-center justify-center`}
                          >
                            {isLoading && !isSuccess ? (
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
                              <p>Submit</p>
                            )}
                          </button>
                        </Form>
                        <ExpenseModal
                          expense={expense}
                          setAddExpense={setAddExpense}
                          modalOpen={expenseModalOpen}
                          setModalOpen={setExpenseModalOpen}
                        />
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
  
}

export default Expenses;
