import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center px-8 md:px-40 lg:px-[20rem] xl:px-[26rem] bg-gray-100">
      <div className="w-full my-20 bg-white p-8 rounded-2xl shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
