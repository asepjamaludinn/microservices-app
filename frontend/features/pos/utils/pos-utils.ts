export const calculateTax = (subtotal: number, taxRate: number = 0.11) => {
  return subtotal * taxRate;
};

export const calculateTotal = (subtotal: number, taxAmount: number) => {
  return subtotal + taxAmount;
};
