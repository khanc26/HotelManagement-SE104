import { InvoicesStatus } from "@/types/invoice.type";
import clsx from "clsx"; // If you're using clsx, if not, just use template strings

interface StatusBadgeProps {
  status: InvoicesStatus;
}

export const InvoiceStatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyleMap: Record<
    InvoicesStatus,
    { label: string; className: string }
  > = {
    [InvoicesStatus.PAID]: {
      label: "Paid",
      className: "bg-green-100 text-green-800 border border-green-300",
    },
    [InvoicesStatus.UNPAID]: {
      label: "Unpaid",
      className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    },
    [InvoicesStatus.CANCELLED]: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border border-red-300",
    },
  };

  const { label, className } = statusStyleMap[status];

  return (
    <span
      className={clsx(
        "text-xs font-medium px-3 py-1 rounded-full inline-block",
        className
      )}
    >
      {label}
    </span>
  );
};
