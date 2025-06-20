import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const responseCode = searchParams.get("vnp_ResponseCode");

  const isSuccess = responseCode === "00";

  useEffect(() => {
    // Redirect to invoices page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/user-invoices");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Payment {isSuccess ? "Successful" : "Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {isSuccess ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
          <p className="text-center text-muted-foreground">
            {isSuccess
              ? "Your payment has been processed successfully."
              : "Your payment could not be processed. Please try again."}
          </p>
          <Button onClick={() => navigate("/user-invoices")}>
            Return to Invoices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
