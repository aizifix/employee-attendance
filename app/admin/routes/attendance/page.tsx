"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout";
import axios from "axios";

// Define the interface for Attendance and Site data
interface Attendance {
  attendance_id: number;
  employee_name: string;
  site_name: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
}

interface Site {
  site_id: number;
  site_name: string;
}

const Attendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  // Fetch attendance records and sites from the backend
  useEffect(() => {
    const fetchAttendanceAndSites = async () => {
      try {
        // Fetch attendance records
        const attendanceResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchAttendance" } }
        );

        // Fetch sites
        const sitesResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchSites" } }
        );

        if (attendanceResponse.data.success) {
          setAttendanceRecords(attendanceResponse.data.attendance);
        } else {
          console.error(
            "Error fetching attendance:",
            attendanceResponse.data.error
          );
        }

        if (sitesResponse.data.success) {
          setSites(sitesResponse.data.sites);
        } else {
          console.error("Error fetching sites:", sitesResponse.data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAttendanceAndSites();
  }, []);

  // Filter attendance by selected site
  const filteredAttendance = selectedSite
    ? attendanceRecords.filter((record) => record.site_name === selectedSite)
    : attendanceRecords;

  // Handle site selection change
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSite(e.target.value);
  };

  // Function to determine the status color
  const getStatusClass = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-600";
      case "absent":
        return "bg-red-100 text-red-600";
      case "late":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "";
    }
  };

  // Function to view attendance details
  const viewDetails = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setViewModalOpen(true);
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-3">Attendance</h1>

      {/* Site Filter Dropdown */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <select
            className="border border-[#999999] p-2 rounded-[5px]"
            onChange={handleSiteChange}
            value={selectedSite || ""}
          >
            <option value="">All Sites</option>
            {sites.map((site) => (
              <option key={site.site_id} value={site.site_name}>
                {site.site_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full table-auto bg-white shadow rounded-lg">
          <thead className="bg-white sticky top-0 z-10 border-b border-b-[#424242] text-left">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Employee Name</th>
              <th className="px-4 py-2 text-sm font-semibold">Site</th>
              <th className="px-4 py-2 text-sm font-semibold">Date</th>
              <th className="px-4 py-2 text-sm font-semibold">Check-in Time</th>
              <th className="px-4 py-2 text-sm font-semibold">
                Check-out Time
              </th>
              <th className="px-4 py-2 text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record) => (
              <tr key={record.attendance_id} className="border-b relative">
                <td className="px-4 py-2 text-sm">{record.employee_name}</td>
                <td className="px-4 py-2 text-sm">{record.site_name}</td>
                <td className="px-4 py-2 text-sm">{record.date}</td>
                <td className="px-4 py-2 text-sm">{record.check_in_time}</td>
                <td className="px-4 py-2 text-sm">{record.check_out_time}</td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                      record.status
                    )}`}
                  >
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm relative">
                  <div className="flex items-center gap-2">
                    <button onClick={() => viewDetails(record)}>
                      <i className="bx bx-show text-[black] text-[1rem]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {viewModalOpen && selectedAttendance && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-[8px] shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Attendance Details</h2>
            <div className="space-y-4">
              <p>
                <strong>Employee Name:</strong>{" "}
                {selectedAttendance.employee_name}
              </p>
              <p>
                <strong>Site:</strong> {selectedAttendance.site_name}
              </p>
              <p>
                <strong>Date:</strong> {selectedAttendance.date}
              </p>
              <p>
                <strong>Check-in Time:</strong>{" "}
                {selectedAttendance.check_in_time}
              </p>
              <p>
                <strong>Check-out Time:</strong>{" "}
                {selectedAttendance.check_out_time}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedAttendance.status.charAt(0).toUpperCase() +
                  selectedAttendance.status.slice(1)}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="bg-[black] text-white px-4 py-2 rounded text-[14px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Attendance;
