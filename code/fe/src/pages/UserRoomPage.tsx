import { Outlet } from "react-router-dom";

const UserRoomPage = () => {
  return (
    <div className="px-8 py-6">
      <Outlet />
    </div>
  );
};

export default UserRoomPage;
