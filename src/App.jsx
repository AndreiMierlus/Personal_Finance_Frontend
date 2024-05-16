import React, { useEffect } from 'react';
import './css/style.css';
import './charts/ChartjsConfig';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import pages
import AppRoutes from './routes/index';
import { getIncomeLastDate } from './redux/features/income/income.reducer';
import { getUserId } from './utils/Utils';
import { useDispatch} from 'react-redux';
function App() {
  const UserId = getUserId();
  const dispatch=useDispatch()
 
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // triggered on route change
  useEffect(()=>{
    dispatch(getIncomeLastDate(UserId));
  },[])
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  );
}

export default App;
