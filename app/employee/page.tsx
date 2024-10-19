"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Custom Toast Component
const Toast: React.FC<{
  message: string;
  type: "success" | "error";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded shadow-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <p>{message}</p>
      <button onClick={onClose} className="mt-2 text-xs underline">
        Close
      </button>
    </div>
  );
};

const EmployeeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Employee");
  const [leaveType, setLeaveType] = useState<string>("sick");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost/attendance-api/employee.php?operation=fetchUserDetails"
        );
        console.log("Fetched user data: ", userResponse.data);
        if (userResponse.data.success) {
          setUserName(userResponse.data.name);
          sessionStorage.setItem("employee_id", userResponse.data.employee_id); // Store employee ID
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleTabClick = (tab: string) => {
    console.log(`Switching to tab: ${tab}`);
    setActiveTab(tab);
    setMenuOpen(false); // Close the menu after navigation
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost/attendance-api/logout.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Logout response: ", data);

      if (data.success) {
        sessionStorage.removeItem("employee_id");
        router.replace("/");
      } else {
        console.error("Failed to logout:", data.error);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const showToastMessage = (message: string, type: "success" | "error") => {
    console.log(`Showing toast message: ${message}, type: ${type}`);
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleLeaveSubmit = async () => {
    const employeeId = sessionStorage.getItem("employee_id");
    console.log("Submitting leave request for employee_id: ", employeeId);

    try {
      const response = await axios.post(
        "http://localhost/attendance-api/employee.php?operation=requestLeave",
        {
          employee_id: employeeId,
          leave_type: leaveType,
          description: description,
          start_date: startDate,
          end_date: endDate,
        }
      );

      console.log("Leave request response: ", response.data);

      if (response.data.success) {
        showToastMessage("Leave request submitted successfully.", "success");
      } else {
        showToastMessage("Failed to submit leave request.", "error");
      }
    } catch (error) {
      showToastMessage("Error submitting leave request.", "error");
      console.error("Error submitting leave request:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-black text-white flex justify-between p-4">
        <h1 className="text-xl">Employee App</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <i className="bx bx-menu text-3xl"></i>
        </button>
      </header>

      <nav
        className={`fixed top-0 left-0 bg-gray-800 text-white w-64 h-full transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <ul className="mt-16">
          <li
            className={`p-4 cursor-pointer ${
              activeTab === "Dashboard" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleTabClick("Dashboard")}
          >
            <i className="bx bx-home mr-2"></i> Dashboard
          </li>
          <li
            className={`p-4 cursor-pointer ${
              activeTab === "Leaves" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleTabClick("Leaves")}
          >
            <i className="bx bx-calendar-check mr-2"></i> Apply Leave
          </li>
          <li
            className="p-4 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            <i className="bx bx-log-out mr-2"></i> Log Out
          </li>
        </ul>
      </nav>

      <div className="flex-1 p-4">
        {activeTab === "Dashboard" && (
          <div>
            <h2 className="text-2xl font-bold">Hello, {userName}</h2>
            <p>Welcome to your dashboard.</p>
          </div>
        )}

        {activeTab === "Leaves" && (
          <div>
            <h2 className="text-2xl font-bold">Apply for Leave</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLeaveSubmit();
              }}
              className="mt-4"
            >
              <label className="block mb-2">Leave Type:</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="mb-4 p-2 border"
              >
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="emergency">Emergency Leave</option>
                <option value="others">Others</option>
              </select>

              <label className="block mb-2">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4 p-2 border w-full"
              />

              <label className="block mb-2">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mb-4 p-2 border w-full"
              />

              <label className="block mb-2">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mb-4 p-2 border w-full"
              />

              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Submit Leave Request
              </button>
            </form>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
