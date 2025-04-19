import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface CardContentSkeletonProps {
  className?: string;
  items?: number;
}

export function CardContentSkeleton({
  className,
  items = 6,
}: CardContentSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
