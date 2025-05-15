import { Link } from "react-router-dom";

export default function NotAuthenticated() {
  return (
    <div className="min-h-[500px] bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-16 w-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-base md:text-2xl font-bold text-gray-800 mb-2">
          Not Authenticated
        </p>
        <p className="text-gray-600 mb-6">
          It looks like you're not signed in. Please sign in to continue.
        </p>
        <Link
          to="/auth/sign-in"
          className="inline-block bg-black text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
