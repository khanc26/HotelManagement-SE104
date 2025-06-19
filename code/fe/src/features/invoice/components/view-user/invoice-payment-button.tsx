import { Button } from "@/components/ui/button";
import { InvoicesStatus } from "@/types/invoice.type";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { payInvoice } from "@/api/payments";

export const InvoicePaymentButton = ({
  invoiceId,
  amount,
  status,
}: {
  invoiceId: string;
  amount: number;
  status: InvoicesStatus;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation({
    mutationFn: () => payInvoice(invoiceId, amount),
    onSuccess: (data: { paymentUrl: string }) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    },
    onMutate: () => {
      setIsProcessing(true);
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const handlePayment = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return (
    <div className="flex items-center gap-2">
      {status === InvoicesStatus.UNPAID && (
        <Button
          onClick={handlePayment}
          variant="default"
          size="sm"
          disabled={mutation.isPending || isProcessing}
        >
          {mutation.isPending || isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      )}
    </div>
  );
};