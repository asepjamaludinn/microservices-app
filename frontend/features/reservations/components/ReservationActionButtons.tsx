import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface ReservationActionButtonsProps {
  id: number;
  status: string;
  isProcessing: boolean;
  onStatusChange: (
    id: number,
    action: "confirm" | "complete" | "cancel",
  ) => void;
}

export default function ReservationActionButtons({
  id,
  status,
  isProcessing,
  onStatusChange,
}: ReservationActionButtonsProps) {
  return (
    <div className="flex gap-2 justify-end">
      {status === "pending" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isProcessing}
          onClick={() => onStatusChange(id, "confirm")}
          className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 text-xs"
        >
          Confirm
        </Button>
      )}
      {status === "confirmed" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isProcessing}
          onClick={() => onStatusChange(id, "complete")}
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8 text-xs"
        >
          <CheckCircle2 size={14} className="mr-1" /> Complete
        </Button>
      )}
      {(status === "pending" || status === "confirmed") && (
        <Button
          size="sm"
          variant="outline"
          disabled={isProcessing}
          onClick={() => onStatusChange(id, "cancel")}
          className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs"
        >
          <XCircle size={14} className="mr-1" /> Cancel
        </Button>
      )}
    </div>
  );
}
