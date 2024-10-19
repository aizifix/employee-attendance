"use client";

import React from "react";
import SideNav from "../../components/SideNav";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex">
      <SideNav />

      <div className="flex-1 p-6 ml-[230px]">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>
          Welcome, Admin! Here you can manage events, users, attendance, and
          more.
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p>
            Use the sidebar to navigate to different sections such as Events,
            Users, Attendance, and Tribus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
