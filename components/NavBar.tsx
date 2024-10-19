import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Track the open/close state of the sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-[#277c49] flex items-center justify-end px-3 py-2 text-[40px] text-white">
        <i className="bx bx-menu cursor-pointer" onClick={toggleSidebar} />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#277c49] text-white z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out w-[250px]`}
      >
        <div className="p-4">
          <i
            className="bx bx-x text-[40px] cursor-pointer"
            onClick={toggleSidebar}
          />
          <ul className="mt-5 space-y-4">
            <li>
              <Link href="/events">
                <span className="text-white hover:underline">Events</span>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <span className="text-white hover:underline">Settings</span>
              </Link>
            </li>
            <li>
              <Link href="/">
                <span className="text-white hover:underline">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay to close sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default NavBar;
