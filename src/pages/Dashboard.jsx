import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import FinancialCard from '../partials/dashboard/FinancialCard';

import FinanceGrid from '../partials/dashboard/IncomeGrid';
import Banner from '../partials/Banner';
import { useDispatch, useSelector } from 'react-redux';
import { getIncome } from '../redux/features/income/income.reducer';
import { calculateIsGoalComplete, getLatestItem, getUserId, getUserToken, totalPrice } from '../utils/Utils';
import { getExpense } from '../redux/features/expense/expense.reducer';
import ExpenseGrid from '../partials/dashboard/ExpenseGrid';
import { getGoal } from '../redux/features/goal.reducer';
import GoalGrid from '../partials/dashboard/GoalGrid';
import { goalSet } from '../redux/features/goal.slice';
function Dashboard() {
  const userId = getUserId();
  const dispatch = useDispatch();

  const { incomes, isLoading, isSucess } = useSelector((state) => state.income);
  const [graphItem, setGraphItem] = useState({ goal: '', incomes: '', expenses: '' });
  const { expenses } = useSelector((state) => state.expense);
  const { goal } = useSelector((state) => state.goal);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    Promise.all([
      dispatch(getGoal(userId)),
      dispatch(getIncome(userId)),
      dispatch(getExpense(userId)),
    ])
      .then(([goalResponse, incomeResponse, expenseResponse]) => {
        // Handle each response here if needed
        const [goalPayload, incomePayload, expensePayload] = [
          goalResponse,
          incomeResponse,
          expenseResponse,
        ].map((response) => response.payload.data);

        const goalItem = getLatestItem(goalPayload);
        const incomeItem = getLatestItem(incomePayload);
        const expenseItem = getLatestItem(expensePayload);
        setGraphItem({ goal: goalItem, incomes: incomeItem, expenses: expenseItem });
        // console.log('=====Goal response:', goalItem);
        // console.log('=====Income response:', incomeItem);
        // console.log('======Expense response:', expenseItem);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [dispatch, userId]);
  console.log('grpahitem', graphItem);
  useEffect(() => {
    if (goal) {
      const goalValues = calculateIsGoalComplete(goal);
      console.log('goal values===', goalValues);
      dispatch(goalSet(goalValues));
    }
  }, [goal]);
  // calculateIsGoalComplete(goal)
  console.log("graphite",graphItem)
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
            {/* Welcome banner */}
            <WelcomeBanner />
            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              <FinancialCard
                monthly_saving={graphItem?.goal?.monthly_saving || 0}
                fixed_expense={graphItem?.expenses?.monthly_rent || 0}
                additionalExpense={totalPrice(graphItem?.expenses?.other_expense)}
                money_toused={graphItem.incomes.total_income-graphItem?.expenses?.monthly_rent-graphItem?.goal?.monthly_saving}
                title="Monthly Planning"
              />
              {/* <FinancialCard
                monthly_saving={graphItem?.goal? graphItem?.goal.monthly_saving || 0 : 0}
                fixed_expense={graphItem?.expenses?.total_expense ? graphItem?.expenses?.total_expense : 0}
                money_toused={
                  (graphItem?.goal?.monthly_saving ?? 0) -graphItem?.
                  (graphItem?.incomes?.total_income ?? 0) -
                  (graphItem?.expenses?.total_expense ?? 0)
                }
                title="Monthly Planing"
              /> */}

              {/* <FinancialCard
                monthly_saving={goal?.length ? goal[0].monthly_saving || 0 : 0}
                fixed_expense={expenses?.[0]?.total_expense ? expenses[0].total_expense : 0}
                money_toused={
                  (goal?.[0]?.monthly_saving ?? 0) -
                  (incomes?.[0]?.total_income ?? 0) -
                  (expenses?.[0]?.total_expense ?? 0)
                }
                title="Actual Transactions"
              /> */}
              <GoalGrid />
              <FinanceGrid />
              <ExpenseGrid />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
