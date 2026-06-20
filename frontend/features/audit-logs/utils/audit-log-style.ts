export const getActionColor = (action: string) => {
  const act = action.toUpperCase();
  if (act.includes("CREATED"))
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  if (act.includes("UPDATED"))
    return "text-blue-600 bg-blue-50 border-blue-100";
  if (
    act.includes("DELETED") ||
    act.includes("CANCELLED") ||
    act.includes("REFUNDED")
  )
    return "text-red-600 bg-red-50 border-red-100";
  if (act.includes("DEDUCTED"))
    return "text-orange-600 bg-orange-50 border-orange-100";
  return "text-slate-600 bg-slate-100 border-slate-200";
};
