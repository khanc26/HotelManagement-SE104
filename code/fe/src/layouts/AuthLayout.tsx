import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-2/3 max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;