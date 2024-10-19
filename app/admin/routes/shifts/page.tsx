"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout";
import axios from "axios";

// Define interfaces
interface Employee {
  employee_id: number;
  name: string; // Combined first_name and last_name as "Name"
}

interface Site {
  site_id: number;
  site_name: string;
}

interface Shift {
  shift_id: number;
  employee_id: number;
  employee_name: string;
  site_name: string;
  shift_date: string;
  shift_start_time: string;
  shift_end_time: string;
}

const Shifts: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newShift, setNewShift] = useState({
    employee_id: "",
    site_id: "",
    shift_date: "",
    shift_start_time: "",
    shift_end_time: "",
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch employees, sites, and shifts from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchEmployees" } }
        );

        const sitesResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchSites" } }
        );

        const shiftsResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchShifts" } }
        );

        if (employeesResponse.data.success) {
          const employeesWithFullName = employeesResponse.data.employees.map(
            (emp: any) => ({
              ...emp,
              name: `${emp.first_name} ${emp.last_name}`, // Combine first_name and last_name
            })
          );
          setEmployees(employeesWithFullName);
        } else {
          console.error(
            "Error fetching employees:",
            employeesResponse.data.error
          );
        }

        if (sitesResponse.data.success) {
          setSites(sitesResponse.data.sites);
        } else {
          console.error("Error fetching sites:", sitesResponse.data.error);
        }

        if (shiftsResponse.data.success) {
          setShifts(shiftsResponse.data.shifts);
        } else {
          console.error("Error fetching shifts:", shiftsResponse.data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter employees to show only those who are not assigned a shift
  const availableEmployees = employees.filter(
    (employee) =>
      !shifts.some((shift) => shift.employee_id === employee.employee_id)
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewShift({ ...newShift, [name]: value });
  };

  // Function to add a shift
  const addShift = async () => {
    if (
      !newShift.employee_id ||
      !newShift.site_id ||
      !newShift.shift_date ||
      !newShift.shift_start_time ||
      !newShift.shift_end_time
    ) {
      setToastMessage("All fields are required.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/attendance-api/admin.php",
        {
          operation: "addShift",
          employee_id: newShift.employee_id,
          site_id: newShift.site_id,
          shift_date: newShift.shift_date,
          shift_start_time: newShift.shift_start_time,
          shift_end_time: newShift.shift_end_time,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setShifts([
          ...shifts,
          {
            shift_id: response.data.shift_id,
            employee_id: Number(newShift.employee_id),
            employee_name: `${
              employees.find(
                (emp) => emp.employee_id === Number(newShift.employee_id)
              )?.name
            }`,
            site_name:
              sites.find((site) => site.site_id === Number(newShift.site_id))
                ?.site_name || "",
            shift_date: newShift.shift_date,
            shift_start_time: newShift.shift_start_time,
            shift_end_time: newShift.shift_end_time,
          },
        ]);
        setToastMessage("Shift added successfully");
        setNewShift({
          employee_id: "",
          site_id: "",
          shift_date: "",
          shift_start_time: "",
          shift_end_time: "",
        });
        handleCloseModal(); // Reset form after closing modal
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage("Error adding shift.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error adding shift:", error);
      setToastMessage("Error adding shift.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Function to close modal and reset form
  const handleCloseModal = () => {
    setNewShift({
      employee_id: "",
      site_id: "",
      shift_date: "",
      shift_start_time: "",
      shift_end_time: "",
    });
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded">
          {toastMessage}
        </div>
      )}

      <h1 className="text-xl font-bold mb-3">Shifts Management</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[14px] bg-black text-white px-4 py-2 rounded-[8px] shadow"
        >
          Add Shift +
        </button>
      </div>

      {/* Shifts Table */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full table-auto bg-white shadow rounded-lg">
          <thead className="bg-white sticky top-0 z-10 border-b border-b-[#424242] text-left">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Employee Name</th>
              <th className="px-4 py-2 text-sm font-semibold">Site Name</th>
              <th className="px-4 py-2 text-sm font-semibold">Shift Date</th>
              <th className="px-4 py-2 text-sm font-semibold">Check-In Time</th>
              <th className="px-4 py-2 text-sm font-semibold">
                Check-Out Time
              </th>
              <th className="px-4 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.shift_id} className="border-b relative">
                <td className="px-4 py-2 text-sm">{shift.employee_name}</td>
                <td className="px-4 py-2 text-sm">{shift.site_name}</td>
                <td className="px-4 py-2 text-sm">{shift.shift_date}</td>
                <td className="px-4 py-2 text-sm">{shift.shift_start_time}</td>
                <td className="px-4 py-2 text-sm">{shift.shift_end_time}</td>
                <td className="px-4 py-2 text-sm relative">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        alert(`Editing shift for ${shift.employee_name}`)
                      }
                    >
                      <i className="bx bx-edit text-[black] text-[1rem]"></i>
                    </button>
                    <button
                      onClick={() =>
                        alert(`Deleting shift for ${shift.employee_name}`)
                      }
                    >
                      <i className="bx bx-trash text-[black] text-[1rem]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Shift Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-[8px] shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Shift</h2>
            <form className="space-y-4">
              <select
                name="employee_id"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newShift.employee_id}
                defaultValue={""}
              >
                <option value="" disabled>
                  Select Employee
                </option>
                {availableEmployees.map((employee) => (
                  <option
                    key={employee.employee_id}
                    value={employee.employee_id}
                  >
                    {employee.name} {/* Using the combined full name */}
                  </option>
                ))}
              </select>

              <select
                name="site_id"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newShift.site_id}
                defaultValue={""}
              >
                <option value="" disabled>
                  Select Site
                </option>
                {sites.length > 0 ? (
                  sites.map((site) => (
                    <option key={site.site_id} value={site.site_id}>
                      {site.site_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No Sites Available
                  </option>
                )}
              </select>

              <input
                type="date"
                name="shift_date"
                placeholder="Shift Date"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
              />

              <input
                type="time"
                name="shift_start_time"
                placeholder="Check-In Time"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
              />

              <input
                type="time"
                name="shift_end_time"
                placeholder="Check-Out Time"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCloseModal}
                  className="border border-[black] text-[black] px-4 py-2 rounded text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-[black] text-white px-4 py-2 rounded text-[14px]"
                  onClick={addShift}
                >
                  Add Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Shifts;
