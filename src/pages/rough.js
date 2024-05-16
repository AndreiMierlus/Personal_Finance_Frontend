import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage , useFormik} from 'formik';
import ExpenseModal from '../components/ExpenseModal';
import IncomeModal from '../components/IncomeModal';

import { useDispatch, useSelector } from 'react-redux';
import { createIncome } from '../redux/features/income/income.reducer';
import { getUserId } from '../utils/Utils';
import { useNavigate } from 'react-router-dom';
import { clearState, clearSuccess } from '../redux/features/income/income.slice';
import { useEffect } from 'react';

const validationSchema = Yup.object().shape({
  monthly_income: Yup.number()
    .required('Monthly income is required')
    .min(0, 'Monthly income must be a positive number'),
  date: Yup.date().required('Date is required'),
});

function Income() {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError } = useSelector((state) => state.income);
  const userId = getUserId();
  const dispatch = useDispatch();
  const [totalIncome, setTotalIncome] = useState(0);
  const [income, setIncome] = useState([]);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editItem, setEditingItem] = useState('');
  // Reducer function to calculate the total price
  const totalPriceReducer = (accumulator, currentValue) => accumulator + currentValue.price;
  // Calculate the total price using the reducer
  let totalPrice = income.reduce(totalPriceReducer, 0);
  
  const formik = useFormik({
    initialValues: {
      monthly_income: '',
      date: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        setIsLoading(true);
        const incomeWithoutId = income.map(({ _id, ...rest }) => rest);
        const data = {
          monthly_income: values.monthly_income,
          date: values.date,
          total_income: totalIncome,
          extra_income: incomeWithoutId,
        };
        const res = await dispatch(createIncome(data));
        if (res.statusCode) {
          actions.resetForm({
            values: {
              monthly_income: '',
              date: '',
            },
          });
          setIsSuccess(true);
          setIncome([]);
          dispatch(clearSuccess());
        } else {
          console.log("Error:", res);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFormValuesChange = (values) => {
    setTotalIncome(Number(values.monthly_income) + Number(totalPrice));
  };

  useEffect(() => {
    if (isError) {
      clearState();
    }
    if (isSuccess) {
      navigate('/');
    }
    return () => {
      clearSuccess();
    };
  }, [isError, isSuccess]);
  return (
    <div className="flex h-screen overflow-hidden">
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
                    <div class="text-sm text-gray-500">Monthly Income</div>
                    <div class="font-bold text-lg">
                    RON<span id="yearly-cost-result">{totalIncome}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full lg:w-[60%] bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 p-5">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Add Monthly Income
                </h1>
                <Formik {...formik}>
      <Form className="mt-5">
        <div className="mb-5">
          <label htmlFor="monthly_income">Monthly Income</label>
          <Field type="number" name="monthly_income" />
          <ErrorMessage name="monthly_income" component="div" />
        </div>
        <div className="mb-5">
          <label htmlFor="date">Date</label>
          <Field type="date" name="date" />
          <ErrorMessage name="date" component="div" />
        </div>
        {/* Other form fields and UI elements */}
        <button type="submit">
          {isLoading && !isSuccess ? (
            <>
              <svg
                className="mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="font-medium">Loading...</span>
            </>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </Form>
    </Formik>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Income;



//  import React, { useState, useEffect } from 'react';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { getExpense } from '../redux/features/expense/expense.reducer';
// import { getUserId } from '../utils/Utils';
// import { getIncome } from '../redux/features/income/income.reducer';
// import { createGoal, getGoal } from '../redux/features/goal.reducer';
// import { data } from 'autoprefixer';

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
//   percentage: Yup.number()
//     .required('Percentage is required')
//     .min(0, 'Percentage must be a positive number'),
// });

// function Goals() {
//   const UserId = getUserId();
//   const dispatch = useDispatch();
//   const { incomes, isLoading, isSucess } = useSelector((state) => state.income);
//   console.log("incones",incomes)
//   const { expenses } = useSelector((state) => state.expense);
//   const [monthlySaving, setMonthlySaving] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   function calculateMonthsToGoal(monthlyIncome, monthlyExpenses, carPrice, savingsPercentage) {
//     // Calculate monthly savings based on percentage
//     const monthlySavingsPercentage = monthlyIncome * (savingsPercentage / 100);

//     // Add monthly savings from percentage to existing savings
//     const totalMonthlySavings = monthlySavingsPercentage + (monthlyIncome - monthlyExpenses);
//     setMonthlySaving(totalMonthlySavings);
//     console.log(totalMonthlySavings, 'totalMonthlySavings====');
//     // setMonthlySaving(totalMonthlySavings);
//     // Check if savings percentage is valid (0 to 100)
//     if (savingsPercentage < 0 || savingsPercentage > 100) {
//       setErrorMessage('Invalid savings percentage. Must be between 0 and 100.');
//     } else if (totalMonthlySavings > monthlyIncome) {
//       setErrorMessage('Monthly savings exceed monthly income. Please review your finances.');
//     } else if (totalMonthlySavings > 1.3 * monthlyIncome) {
//       setErrorMessage('Monthly savings exceed monthly income by 30%. Please review your finances.');
//     } else {
//       setErrorMessage('');
//       // Calculate total savings needed
//       const totalSavingsNeeded = carPrice;
//       // Calculate months needed
//       const monthsNeeded = Math.ceil(totalSavingsNeeded / totalMonthlySavings);

//       return monthsNeeded;
//     }
//   }
//   const [monthsToGoal, setMonthsToGoal] = useState('');
//   useEffect(() => {
//     dispatch(getIncome(UserId));
//     dispatch(getExpense(UserId));
//   }, []);
//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Content area */}
//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
//         {/*  Site header */}
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <main>
//           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
//             <div className="flex flex-col items-center justify-center gap-5">
//               <div class="w-full lg:w-[60%]">
//                 <div class="flex flex-row bg-white shadow-sm rounded p-4">
//                   <div class="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500">
//                     <svg
//                       class="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 5v14m-6-7h12"
//                       ></path>
//                       <circle cx="6" cy="12" r="2" fill="currentColor"></circle>
//                       <circle cx="18" cy="12" r="2" fill="currentColor"></circle>
//                     </svg>
//                   </div>

//                   <div class="flex flex-col flex-grow ml-4">
//                     <div class="font-bold text-lg mt-2">
//                       <span id="yearly-cost-result">{`It will take ${
//                         monthsToGoal !== undefined ? monthsToGoal : 0
//                       } month to reach your goal`}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col w-full lg:w-[60%] bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 p-5">
//                 <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
//                   Setting Your Goals
//                 </h1>
//                 <Formik
//                   initialValues={{
//                     name: '',
//                     price: '',
//                     percentage: 0,
//                   }}
//                   validationSchema={validationSchema}
//                   onSubmit={(values) => {
//                     let data = {
//                       UserId: UserId,
//                       name: values.name,
//                       price: values.price,
//                       percentage: values.percentage,
//                       timeto_take: monthsToGoal,
//                       monthly_saving: monthlySaving,
//                     };
//                     dispatch(createGoal(data));
//                   }}
//                 >
//                   {({ values }) => {
//                     const monthsToGoal = calculateMonthsToGoal(
//                       Number(incomes[0]?.total_income),
//                       Number(expenses[0]?.total_expense),
//                       values?.price,
//                       values?.percentage
//                     );
//                     setMonthsToGoal(monthsToGoal);
//                     console.log(monthsToGoal);
//                     return (
//                       <>
//                         <Form className="mt-5">
//                           <div className="mb-5">
//                             <label
//                               className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
//                               htmlFor="name"
//                             >
//                               Total Income
//                             </label>
//                             <input
//                               name="username"
//                               value={incomes[0]?.total_income}
//                               type="text"
//                               disabled={true}
//                               autocomplete="off"
//                               placeholder="Enter your Income"
//                               className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
//                             />
//                           </div>
//                           <div className="mb-5">
//                             <label
//                               className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
//                               htmlFor="name"
//                             >
//                               Total Expense
//                             </label>
//                             <input
//                               name="username"
//                               value={expenses[0]?.total_expense}
//                               type="text"
//                               disabled={true}
//                               autocomplete="off"
//                               className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
//                             />
//                           </div>
//                           <div className="mb-5">
//                             <label
//                               className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
//                               htmlFor="name"
//                             >
//                               Name
//                             </label>
//                             <Field
//                               type="text"
//                               name="name"
//                               className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
//                             />
//                             <ErrorMessage
//                               name="name"
//                               component="div"
//                               className="text-sm font-medium text-red-600"
//                             />
//                           </div>
//                           <div className="mb-5">
//                             <label
//                               className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
//                               htmlFor="price"
//                             >
//                               Price
//                             </label>
//                             <Field
//                               type="number"
//                               name="price"
//                               className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
//                             />
//                             <ErrorMessage
//                               name="price"
//                               component="div"
//                               className="text-sm font-medium text-red-600"
//                             />
//                           </div>
//                           <div className="mb-5">
//                             <label
//                               className="block text-sm font-bold mb-1 text-slate-800 dark:text-slate-100"
//                               htmlFor="percentage"
//                             >
//                               Percentage
//                             </label>
//                             <Field
//                               type="number"
//                               name="percentage"
//                               className="rounded w-full text-slate-800 dark:text-slate-100 bg-transparent"
//                             />
//                             <ErrorMessage
//                               name="percentage"
//                               component="div"
//                               className="text-sm font-medium text-red-600"
//                             />
//                             {errorMessage && (
//                               <label
//                                 className="block text-sm font-bold mb-1 text-red-600"
//                                 htmlFor="errorMessage"
//                               >
//                                 {errorMessage}
//                               </label>
//                             )}
//                           </div>
//                           <button
//                             type="submit"
//                             className={`${
//                               errorMessage || values.percentage < 0 || values.percentage > 100
//                                 ? 'bg-[#cac7ff] text-white px-6 py-2 text-sm font-medium rounded-md cursor-not-allowed'
//                                 : 'bg-[#4F46E5] hover:bg-[#433BCB] text-white px-6 py-2 text-sm font-medium rounded-md'
//                             }`}
//                             disabled={errorMessage != ''}
//                           >
//                             Submit
//                           </button>
//                         </Form>
//                       </>
//                     );
//                   }}
//                 </Formik>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Goals;