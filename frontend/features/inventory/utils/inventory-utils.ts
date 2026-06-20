export const calculateBarWidth = (stock: number) => {
  const MAX_CAPACITY = 20000;
  const percentage = (stock / MAX_CAPACITY) * 100;
  return Math.min(Math.max(percentage, 2), 100);
};
