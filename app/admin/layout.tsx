"use client";

import React from "react";
import SideNav from "../../components/SideNav";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main content on the right side */}
      <div className="flex-1 p-6 ml-[110px]">{children}</div>
    </div>
  );
};

export default AdminLayout;
