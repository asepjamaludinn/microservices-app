export function formatDateTime(dateString: string) {
  if (!dateString) return "-";

  return new Date(dateString)
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}

export function getWaitingMinutes(createdAt: string) {
  const diffMs = new Date().getTime() - new Date(createdAt).getTime();

  return Math.floor(diffMs / 60000);
}
