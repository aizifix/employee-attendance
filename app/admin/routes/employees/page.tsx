"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout";
import axios from "axios";

// Define interfaces
interface Department {
  department_id: number;
  department_name: string;
}

interface Employee {
  employee_id: number;
  name: string; // Combined first_name and last_name as "Name"
  department_id: number;
  department_name: string;
  email: string;
  phone_number: string;
  username: string;
  password?: string;
  status: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    department_id: 0,
    email: "",
    phone_number: "",
    username: "",
    password: "",
    status: "active",
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch departments and employees from the backend
  useEffect(() => {
    const fetchDepartmentsAndEmployees = async () => {
      try {
        const departmentsResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchDepartments" } }
        );
        const employeesResponse = await axios.get(
          "http://localhost/attendance-api/admin.php",
          { params: { operation: "fetchEmployees" } }
        );

        if (departmentsResponse.data.success) {
          setDepartments(departmentsResponse.data.departments);
        } else {
          console.error(
            "Error fetching departments:",
            departmentsResponse.data.error
          );
        }

        if (employeesResponse.data.success) {
          // Combine first_name and last_name as "name"
          const employeesWithFullName = employeesResponse.data.employees.map(
            (emp: any) => ({
              ...emp,
              name: `${emp.first_name} ${emp.last_name}`,
            })
          );
          setEmployees(employeesWithFullName);
        } else {
          console.error(
            "Error fetching employees:",
            employeesResponse.data.error
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDepartmentsAndEmployees();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  const saveEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.department_id ||
      !newEmployee.email ||
      !newEmployee.phone_number ||
      !newEmployee.username ||
      !newEmployee.password
    ) {
      setToastMessage("All fields are required");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    // Split the "Name" into first_name and last_name for the backend
    const [first_name, ...lastNameArray] = newEmployee.name?.split(" ") || [];
    const last_name = lastNameArray.join(" ");

    try {
      const response = await axios.post(
        "http://localhost/attendance-api/admin.php",
        {
          operation: "addEmployee",
          first_name,
          last_name,
          ...newEmployee,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const savedEmployee = {
          ...newEmployee,
          employee_id: response.data.employee_id,
        } as Employee;

        // Add the new employee to the list
        setEmployees([...employees, savedEmployee]);

        // Show a success message
        setToastMessage(`${newEmployee.name} added to employees`);

        // Collapse modal after submission
        setIsModalOpen(false);

        // Remove the toast after 3 seconds
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        const errorMsg = response.data.error || "Unknown error occurred";
        setToastMessage(errorMsg);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      setToastMessage("Error adding employee");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <AdminLayout>
      {/* Display toast message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded">
          {toastMessage}
        </div>
      )}

      <h1 className="text-xl font-bold mb-3">Employee Management</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[14px] bg-black text-white px-4 py-2 rounded-[8px] shadow"
        >
          Add Employee +
        </button>
      </div>

      {/* Employee Table */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full table-auto bg-white shadow rounded-lg">
          <thead className="bg-white sticky top-0 z-10 border-b border-b-[#424242] text-left">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-sm font-semibold">Department</th>
              <th className="px-4 py-2 text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-sm font-semibold">Phone</th>
              <th className="px-4 py-2 text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id} className="border-b relative">
                <td className="px-4 py-2 text-sm">{employee.name}</td>
                <td className="px-4 py-2 text-sm">
                  {employee.department_name || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm">{employee.email}</td>
                <td className="px-4 py-2 text-sm">{employee.phone_number}</td>
                <td className="px-4 py-2 text-sm">
                  {employee.status === "active" ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm relative">
                  <div className="flex items-center gap-2">
                    <button>
                      <i className="bx bx-edit text-[black] text-[1rem]"></i>
                    </button>
                    <button>
                      <i className="bx bx-trash text-[black] text-[1rem]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-[8px] shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveEmployee();
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newEmployee.name}
                required
              />

              <select
                name="department_id"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newEmployee.department_id?.toString() || ""}
                required
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option
                    key={department.department_id}
                    value={department.department_id.toString()}
                  >
                    {department.department_name}
                  </option>
                ))}
              </select>

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newEmployee.email}
                required
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newEmployee.phone_number}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newEmployee.username}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded"
                onChange={handleInputChange}
                value={newEmployee.password}
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border border-[black] text-[black] px-4 py-2 rounded text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[black] text-white px-4 py-2 rounded text-[14px]"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Employees;
