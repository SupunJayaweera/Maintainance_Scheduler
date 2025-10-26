import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
};

export default UserLayout;
