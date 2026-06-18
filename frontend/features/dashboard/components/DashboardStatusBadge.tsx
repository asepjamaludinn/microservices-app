export default function DashboardStatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="bg-[#ff5722] text-white px-3 py-1 rounded-md text-xs font-bold">
        Completed
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold">
        Cancelled
      </span>
    );
  }

  return (
    <span className="bg-[#ffcc80] text-orange-900 px-3 py-1 rounded-md text-xs font-bold capitalize">
      On Process
    </span>
  );
}
