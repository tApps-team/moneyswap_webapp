export const formatDate = (dateString: string): string => {
  const [day, month, year] = dateString.split(".");
  const shortYear = year.slice(-2); // Get the last two digits of the year
  return `${day}.${month}.${shortYear}`;
};
