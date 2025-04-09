import Sidebar from "@components/Sidebar";
import Topbar from "@components/Topbar";
import { Outlet } from "react-router-dom";

const DashboardAdmin = () => {
  return (
    <div className="flex min-h-screen bg-olive-50">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-white">
        <Topbar />

        

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardAdmin;
