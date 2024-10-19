"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout";
import axios from "axios";
import QRCode from "react-qr-code"; // Import the QRCode component

interface Site {
  site_id: number;
  site_name: string;
  site_location: string;
  status: string;
}

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false); // State for QR Code Modal
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState<boolean>(false); // State for Add Site Modal
  const [qrData, setQrData] = useState<{
    site_name: string;
    site_location: string;
  } | null>(null);
  const [newSite, setNewSite] = useState({
    site_name: "",
    site_location: "",
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null); // Validation state
  const [username, setUsername] = useState<string>(""); // Username input state
  const [siteIdForAttendance, setSiteIdForAttendance] = useState<number | null>(
    null
  ); // Site ID to mark attendance

  // Fetch sites from the backend
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(
          "http://localhost/attendance-api/admin.php",
          {
            params: { operation: "fetchSites" },
          }
        );

        if (response.data.success) {
          setSites(response.data.sites);
        } else {
          console.error("Error fetching sites:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchSites();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSite({
      ...newSite,
      [name]: value,
    });
  };

  // Function to handle adding a new site
  const addSite = async () => {
    if (!newSite.site_name || !newSite.site_location) {
      setToastMessage("Site name and location are required.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/attendance-api/admin.php",
        {
          operation: "addSite",
          site_name: newSite.site_name,
          site_location: newSite.site_location,
          status: "active", // Default status for new sites
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSites([
          ...sites,
          { site_id: response.data.site_id, ...newSite, status: "active" },
        ]);
        setToastMessage(`${newSite.site_name} added successfully`);
        setNewSite({ site_name: "", site_location: "" });
        setIsAddSiteModalOpen(false); // Close the Add Site modal
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage("Error adding site.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error adding site:", error);
      setToastMessage("Error adding site.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Function to handle showing QR code in modal
  const handleGenerateQRCode = (site: Site) => {
    setQrData({ site_name: site.site_name, site_location: site.site_location });
    setSiteIdForAttendance(site.site_id); // Set the site ID for marking attendance
    setIsQrModalOpen(true); // Open the QR Code modal
  };

  // Function to handle username validation and mark attendance
  const validateUsernameAndMarkAttendance = async () => {
    try {
      console.log("Sending username:", username);
      console.log("Sending site_id:", siteIdForAttendance);

      // Call the backend to mark attendance (check-in or check-out)
      const attendanceResponse = await axios.post(
        "http://localhost/attendance-api/admin.php",
        {
          operation: "addAttendance",
          username: username,
          site_id: siteIdForAttendance,
        }
      );

      console.log("Attendance API response:", attendanceResponse.data);

      if (attendanceResponse.data.success) {
        setIsValid(true);
        setToastMessage("Attendance recorded successfully!");
      } else {
        setIsValid(false);
        setToastMessage(attendanceResponse.data.message);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setIsValid(false);
      setToastMessage("Error recording attendance.");
    }

    setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3s
  };

  // Close the QR Code Modal
  const closeQrModal = () => {
    setIsQrModalOpen(false);
    setQrData(null); // Reset the QR data
    setUsername(""); // Reset username input
    setSiteIdForAttendance(null); // Reset site ID
  };

  // Close the Add Site Modal
  const closeAddSiteModal = () => {
    setIsAddSiteModalOpen(false);
  };

  return (
    <AdminLayout>
      {/* Toast message */}
      {toastMessage && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded ${
            isValid ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {toastMessage}
        </div>
      )}

      <h1 className="text-xl font-bold mb-3">Site Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <input
            className="border border-[#999999] p-2 rounded-[5px]"
            placeholder="Search sites..."
          />
          <button
            onClick={() => alert("Search functionality not implemented yet")}
            className="text-[14px] bg-black text-white px-4 py-2 rounded-[8px] shadow"
          >
            Search
          </button>
        </div>
        <button
          onClick={() => setIsAddSiteModalOpen(true)} // Open the Add Site modal
          className="text-[14px] bg-black text-white px-4 py-2 rounded-[8px] shadow"
        >
          Add Site +
        </button>
      </div>

      {/* Site Table */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full table-auto bg-white shadow rounded-lg">
          <thead className="bg-white sticky top-0 z-10 border-b border-b-[#424242] text-left">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Site Name</th>
              <th className="px-4 py-2 text-sm font-semibold">Location</th>
              <th className="px-4 py-2 text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.site_id} className="border-b relative">
                <td className="px-4 py-2 text-sm">{site.site_name}</td>
                <td className="px-4 py-2 text-sm">{site.site_location}</td>
                <td className="px-4 py-2 text-sm">
                  {site.status === "active" ? (
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
                  {/* Icon Menu for Actions */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleGenerateQRCode(site)}>
                      <i className="bx bx-qr text-[black] text-[1rem]"></i>
                    </button>
                    <button onClick={() => alert(`Editing ${site.site_name}`)}>
                      <i className="bx bx-edit text-[black] text-[1rem]"></i>
                    </button>
                    <button onClick={() => alert(`Deleting ${site.site_name}`)}>
                      <i className="bx bx-trash text-[black] text-[1rem]"></i>
                    </button>
                    <button
                      onClick={() => alert(`Archiving ${site.site_name}`)}
                    >
                      <i className="bx bx-archive text-[black] text-[1rem]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal */}
      {isQrModalOpen && qrData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-[8px] shadow-lg w-[300px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">
              QR Code for {qrData.site_name}
            </h2>
            <QRCode value={JSON.stringify(qrData)} size={200} />
            <p className="mt-4 text-lg">Location: {qrData.site_location}</p>

            {/* Input field to enter the username */}
            <input
              type="text"
              placeholder="Enter Employee Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-4 p-2 border rounded"
            />

            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={validateUsernameAndMarkAttendance} // Mark attendance here
            >
              Submit Username
            </button>

            <button
              className="mt-6 bg-black text-white px-4 py-2 rounded-[8px] shadow"
              onClick={closeQrModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Site Modal */}
      {isAddSiteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-[8px] shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Site</h2>
            {/* Site Form Fields */}
            <form className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  name="site_name"
                  placeholder="Site Name"
                  className="w-full px-4 py-2 border rounded"
                  onChange={handleInputChange}
                  value={newSite.site_name}
                />
                <input
                  type="text"
                  name="site_location"
                  placeholder="Site Location"
                  className="w-full px-4 py-2 border rounded"
                  onChange={handleInputChange}
                  value={newSite.site_location}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeAddSiteModal} // Close the Add Site Modal
                  className="border border-[black] text-[black] px-4 py-2 rounded text-[14px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-[black] text-white px-4 py-2 rounded text-[14px]"
                  onClick={addSite}
                >
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Sites;
