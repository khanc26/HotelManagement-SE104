import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CardContentErrorProps {
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export function CardContentError({
  errorMessage = "Failed to load content. Please try again.",
  onRetry,
  className,
}: CardContentErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center p-6",
        className
      )}
    >
      <AlertCircle className="h-8 w-8 text-destructive mb-4" />
      <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  );
}
