"use client";
import Image from "next/image";
import Logo from "../public/logo.png"; // Keep the logo image
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Use both useRouter and usePathname

const SideNav = () => {
  const router = useRouter(); // Use for navigation like logout redirection
  const pathname = usePathname(); // Use for detecting current path

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

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        sessionStorage.removeItem("user");
        router.replace("/"); // Redirect to login page after logout
      } else {
        console.error("Failed to logout:", data.error);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // Function to apply active class conditionally
  const isActive = (route: string) => {
    return pathname === route
      ? "bg-black text-white" // Active style
      : "bg-transparent text-black hover:bg-black hover:text-white";
  };

  return (
    <div className="w-[230px] h-[100vh] border-r border-[#c7c7c7] fixed left-0 top-0 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="flex justify-center items-center py-3">
          <Image alt="Logo" src={Logo} height={100} />
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col gap-2 px-2">
          {/* Dashboard */}
          <Link href="/admin/routes/dashboard">
            <li
              className={`${isActive(
                "/admin/routes/dashboard"
              )} py-2 px-4 rounded-[0.35rem] flex items-center gap-2 cursor-pointer`}
            >
              <i className="bx bxs-dashboard text-xl" />
              <span>Dashboard</span>
            </li>
          </Link>

          {/* Employees */}
          <Link href="/admin/routes/employees">
            <li
              className={`${isActive(
                "/admin/routes/employees"
              )} py-2 px-4 rounded-[0.35rem] flex items-center gap-2 cursor-pointer`}
            >
              <i className="bx bxs-user-detail text-xl" />
              <span>Employees</span>
            </li>
          </Link>

          {/* Attendance */}
          <Link href="/admin/routes/attendance">
            <li
              className={`${isActive(
                "/admin/routes/attendance"
              )} py-2 px-4 rounded-[0.35rem] flex items-center gap-2 cursor-pointer`}
            >
              <i className="bx bxs-check-circle text-xl" />
              <span>Attendance</span>
            </li>
          </Link>

          {/* Site */}
          <Link href="/admin/routes/site">
            <li
              className={`${isActive(
                "/admin/routes/site"
              )} py-2 px-4 rounded-[0.35rem] flex items-center gap-2 cursor-pointer`}
            >
              <i className="bx bx-location-plus text-xl" />
              <span>Site</span>
            </li>
          </Link>

          {/* Shifts */}
          <Link href="/admin/routes/shifts">
            <li
              className={`${isActive(
                "/admin/routes/shifts"
              )} py-2 px-4 rounded-[0.35rem] flex items-center gap-2 cursor-pointer`}
            >
              <i className="bx bxs-calendar-event text-xl" />
              <span>Shifts</span>
            </li>
          </Link>

          {/* Leaves */}
          <Link href="/admin/routes/leaves">
            <li
              className={`${isActive(
                "/admin/routes/leaves"
              )} py-2 px-4 rounded-[0.35rem] flex items-center gap-2 cursor-pointer`}
            >
              <i className="bx bxs-calendar text-xl" />
              <span>Leaves</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* Profile and Logout */}
      <div className="flex items-center px-4 py-3 border-t border-[#c7c7c7]">
        {/* Profile Placeholder */}
        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
          P
        </div>
        {/* Name and Logout */}
        <div className="ml-3">
          {/* <p className="text-sm font-medium text-black">Felix Barzaga</p> */}
          <button
            className="text-sm text-red-600 hover:underline mt-1"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
