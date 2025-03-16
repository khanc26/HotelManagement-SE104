import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PasswordResetSuccessPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Password Reset Successful!</h2>
      <p className="text-gray-600 mb-6">
        Your password has been successfully reset. You can now login with your new password.
      </p>
      <Button asChild className="w-full">
        <Link to="/auth/sign-in">Go to Login</Link>
      </Button>
    </div>
  );
};

export default PasswordResetSuccessPage; 