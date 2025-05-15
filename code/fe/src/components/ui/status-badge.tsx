import clsx from "clsx";

interface StatusBadgeProps<T extends string> {
  status: T;
  statusStyleMap: Record<T, { label: string; className: string }>;
}

export const StatusBadge = <T extends string>({
  status,
  statusStyleMap,
}: StatusBadgeProps<T>) => {
  const { label, className } = statusStyleMap[status] || {
    label: "Unknown",
    className: "bg-gray-100 text-gray-800 border border-gray-300",
  };

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
