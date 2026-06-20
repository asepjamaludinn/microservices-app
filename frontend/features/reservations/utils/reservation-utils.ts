export const getReservationStatusTheme = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "confirmed":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "completed":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default:
      return "bg-red-50 text-red-600 border-red-100";
  }
};
