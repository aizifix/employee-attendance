"use client";
import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen ml-[130px]">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
        {/* <div className="flex items-center">
          <span className="mr-4">Felix Barzaga</span>
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-full w-10 h-10"
          />
        </div> */}
      </header>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black text-white p-6 rounded">
          <h3 className="text-md">Employees Present</h3>
          <p className="text-4xl font-bold">70</p>
          <p className="mt-2 text-gray-400">View Details</p>
        </div>
        <div className="bg-black text-white p-6 rounded">
          <h3 className="text-md">Employees Absent</h3>
          <p className="text-4xl font-bold">20</p>
          <p className="mt-2 text-gray-400">View Details</p>
        </div>
        <div className="bg-black text-white p-6 rounded">
          <h3 className="text-md">Employees Late</h3>
          <p className="text-4xl font-bold">25</p>
          <p className="mt-2 text-gray-400">View Details</p>
        </div>
        <div className="bg-black text-white p-6 rounded">
          <h3 className="text-md">Pending Leave Request</h3>
          <p className="text-4xl font-bold">5</p>
          <p className="mt-2 text-gray-400">View Details</p>
        </div>
        <div className="bg-black text-white p-6 rounded">
          <h3 className="text-md">On Leave</h3>
          <p className="text-4xl font-bold">10</p>
          <p className="mt-2 text-gray-400">View Details</p>
        </div>
        <div className="bg-black text-white p-6 rounded">
          <h3 className="text-md">Total Employees</h3>
          <p className="text-4xl font-bold">100</p>
          <p className="mt-2 text-gray-400">View Details</p>
        </div>
      </div>

      {/* Charts and Top Employees */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">Employees Chart</h2>
          {/* Placeholder for chart */}
          <div className="h-40 bg-gray-200 mt-4 rounded"></div>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold">Top 5 Late Employees</h2>
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Employee"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2">John Doe</span>
              </div>
              <span>10</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Employee"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2">John Doe</span>
              </div>
              <span>8</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Employee"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2">John Doe</span>
              </div>
              <span>5</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/30"
                  alt="Employee"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2">John Doe</span>
              </div>
              <span>5</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
