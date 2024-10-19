"use client";

import { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import Link from "next/link"; // Import Link for navigation

const SimpleQRScanner: React.FC = () => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(true); // Toggle scanning

  // Function to handle QR scan result
  const handleScan = async (data: any) => {
    if (data && data.text) {
      const scannedData = JSON.parse(data.text); // Assuming QR data is in JSON format
      setQrData(scannedData); // Save the scanned data locally
      console.log(`ScannedQRCode: ${data.text}`);

      try {
        // Send the scanned data to the backend via Axios
        const response = await axios.post(
          "http://localhost/attendance/user.php?action=handleAttendance",
          {
            student_id: scannedData.student_id,
            event_id: scannedData.event_id,
          }
        );

        // Update the attendance status based on the response from the backend
        if (response.data.success) {
          setAttendanceStatus(response.data.message); // e.g., "Checked in successfully"
        } else if (response.data.error) {
          setAttendanceStatus(response.data.error); // e.g., "Error: Already checked out"
        }
      } catch (error) {
        console.error("Error updating attendance:", error);
        setAttendanceStatus("Failed to update attendance.");
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  // Function to toggle scanning on/off
  const toggleScanning = () => {
    setIsScanning((prev) => !prev);
    setQrData(null); // Reset QR data when toggling
    setAttendanceStatus(""); // Reset the status message
  };

  // Function to reset the scanning result
  const resetScan = () => {
    setQrData(null); // Clear QR data
    setAttendanceStatus(""); // Clear status message
    setIsScanning(true); // Enable scanning again
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Back Button */}
      <Link href="/sbo" className="self-start mb-4 text-blue-500 underline">
        &larr; Back
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">QR Scanner</h1>

      {/* QR Scanner */}
      {isScanning ? (
        <div className="border-4 border-blue-500 p-2 rounded-lg mb-4">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "300px" }}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500">Scanning stopped</div>
      )}

      {/* Display Scanned Data */}
      {qrData && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-semibold">Scanned Data:</h2>
          <pre className="text-sm">{JSON.stringify(qrData, null, 2)}</pre>
        </div>
      )}

      {/* Display Attendance Status */}
      {attendanceStatus && (
        <div className="mt-4 bg-green-100 p-4 rounded-lg shadow-md text-green-800">
          {attendanceStatus}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={toggleScanning}
          className={`px-4 py-2 rounded text-white ${
            isScanning ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {isScanning ? "Stop Scanning" : "Start Scanning"}
        </button>

        {isScanning && qrData && (
          <button
            onClick={resetScan}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset Scan
          </button>
        )}
      </div>
    </div>
  );
};

export default SimpleQRScanner;