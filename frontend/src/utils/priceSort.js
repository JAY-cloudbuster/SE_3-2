export const sortByPrice = (data, direction = 'desc') => {
  return [...data].sort((a, b) => {
    return direction === 'desc' ? b.price - a.price : a.price - b.price;
  });
};