import { useToast as useToastOriginal } from "@/components/ui/toast";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  const { toast } = useToastOriginal();
  toast({
    title,
    description,
    variant,
  });
}; 