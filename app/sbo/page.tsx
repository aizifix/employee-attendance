"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code"; // For generating SBO's QR code
import Link from "next/link"; // Import Link for routing

const SboDashboard: React.FC = () => {
  const [sboData, setSboData] = useState<any>(null);

  // Fetch SBO data (you can replace this with actual logic to get SBO's information)
  useEffect(() => {
    const storedData = localStorage.getItem("sboData"); // Assuming SBO data is stored in localStorage
    if (storedData) {
      setSboData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">SBO Dashboard</h1>
      <p className="text-lg mb-6">
        Welcome, SBO! You can scan students' QR codes for attendance tracking or
        access your own QR code below.
      </p>

      {/* SBO's QR Code */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your QR Code:</h2>
        {sboData ? (
          <div className="border-4 border-blue-500 p-2 rounded-lg">
            <QRCode value={JSON.stringify(sboData)} size={150} />
          </div>
        ) : (
          <p>Loading your QR code...</p>
        )}
      </div>

      {/* Camera Icon for navigation to scanner */}
      <Link href="/sbo/scanner">
        <div className="fixed bottom-4 right-4">
          <i
            className="bx bx-camera bx-lg text-white bg-green-500 p-4 rounded-full"
            style={{ fontSize: "40px" }}
          ></i>
        </div>
      </Link>
    </div>
  );
};

export default SboDashboard;
