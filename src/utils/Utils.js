import dayjs from 'dayjs';
import resolveConfig from 'tailwindcss/resolveConfig';

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig('./src/css/tailwind.config.js');
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);
export const getUserToken = () => {
  try {
    // Retrieve the token data from localStorage using the key "persist:root"
    const tokenDataString = localStorage.getItem('user');

    // Parse the token data JSON string to an object
    const tokenData = JSON.parse(tokenDataString);
    console.log('token======', tokenData);
    // debugger
    // Return the accessToken
    return tokenData?.accessToken;
  } catch (error) {
    console.error('Error retrieving access token from localStorage:', error);
    // Handle missing or invalid token gracefully (e.g., redirect to login)
    return null; // Or throw an appropriate error
  }
};
export const getUserId = () => {
  try {
    // Retrieve the token data from localStorage using the key "persist:root"
    const tokenDataString = JSON.parse(localStorage.getItem('user'));

    // const { _id } = tokenDataString || {};
    return tokenDataString?.user?._id;
  } catch (error) {
    console.error('Error retrieving access token from localStorage:', error);
    // Handle missing or invalid token gracefully (e.g., redirect to login)
    return null; // Or throw an appropriate error
  }
};

export const getLatestItem = (item) => {
  const maxCreatedItem = item.reduce((prevGoal, currentGoal) => {
    const prevCreatedAt = new Date(prevGoal.createdAt);
    const currentCreatedAt = new Date(currentGoal.createdAt);
    return prevCreatedAt > currentCreatedAt ? prevGoal : currentGoal;
  }, {});
  return maxCreatedItem;
};
export const calculateIsGoalComplete = (goal) => {
  const maxCreatedAtGoal = getLatestItem(goal);
  if (goal) {
    const { goalTracking, percentage, monthly_saving, price } = maxCreatedAtGoal;
    let totalSavings = 0;
    // Calculate total savings from goal tracking entries
    goalTracking?.forEach(({ totalIncome, totalExpense }) => {
      // const savings = ((totalIncome - totalExpense) * percentage) / 100;
      const savings = ((totalIncome) * percentage) / 100;
      totalSavings += savings;
    });

    const remainingSavings = price - totalSavings;
    const monthsToGoal = Math.ceil(remainingSavings / monthly_saving);

    let status = 'notCompleted';
    if (monthsToGoal < 1) {
      status = 'completed';
    } else if (!monthsToGoal && !remainingSavings) {
      status = 'pending';
    }
    return {
      totalSavings,
      remainingSavings,
      monthsToGoal,
      status,
    };
  }
};

export const dateFormat = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const totalPrice = (items) => {
  if (!items?.length) return 0;
  return items.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.price);
  }, 0);
};
