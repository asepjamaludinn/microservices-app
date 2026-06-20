export const calculateProfitMargin = (
  costPrice: number,
  sellingPrice: number,
) => {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - costPrice) / sellingPrice) * 100;
};
