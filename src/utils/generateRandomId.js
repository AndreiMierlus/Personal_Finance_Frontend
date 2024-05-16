export const generateRandomId = () => {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36
  const randomNumber = Math.random().toString(36).substr(2, 5); // Generate a random number and take a substring
  return timestamp + randomNumber; // Concatenate timestamp and random number
};
