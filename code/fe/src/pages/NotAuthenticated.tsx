import { Link } from "react-router";

export default function NotAuthenticated() {
  return (
    <div>
      <div>You're not authenticated!</div>
      <Link to="/auth/sign-in">Return to sign in page?</Link>
    </div>
  );
}
