"use client";

import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Logo from "../../public/logo.png";
import QrCode from "../../public/qr_code.png";
import Link from "next/link"; // Import for navigation

const User: React.FC = () => {
  const [userRole, setUserRole] = useState("Student"); // Use "Student" or "SBO" to change role

  return (
    <>
      <div>
        <NavBar />
        <div className="flex items-center justify-between p-3">
          <div>
            <h1 className="font-bold text-2xl mb-3">Hello, Jesse</h1>
            <p>
              <b>Current event day:</b> Day 1
            </p>
            <p>
              <b>Tribu:</b> Jungler
            </p>
          </div>
          <div>
            <Image src={Logo} alt="Icon" height={120} />
          </div>
        </div>

        {/* QR Code section */}
        <div className="flex items-center justify-center mt-5">
          <div className="h-[320px] w-[320px] overflow-hidden">
            <Image src={QrCode} alt="qr_code" className="h-full w-full" />
          </div>
        </div>

        {/* Additional Features for SBO */}
        {userRole === "SBO" && (
          <div className="mt-6 text-center">
            <Link href="/qrscanner">
              <button className="bg-[#277c49] text-white py-2 px-4 rounded">
                Open QR Scanner
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default User;
