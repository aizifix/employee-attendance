"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Logo from "../public/logo.png";

const Login: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    idNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToastMessage(null);

    try {
      const response = await axios.post(
        "http://localhost/attendance-api/login.php",
        {
          idNumber: formData.idNumber,
          password: formData.password,
        }
      );

      if (response.data.success) {
        setToastMessage("Login successful!");
        setToastType("success");
        setShowToast(true);
        setLoading(false);

        // Hide toast after 3 seconds and redirect based on the role
        setTimeout(() => {
          setShowToast(false);
          if (response.data.role === "admin") {
            // Redirect to admin dashboard
            router.push("/admin/routes/dashboard");
          } else if (response.data.role === "employee") {
            // Redirect to employee home
            router.push("/employee");
          } else {
            setToastMessage("User role not recognized.");
            setToastType("error");
            setShowToast(true);
          }
        }, 3000);
      } else {
        setToastMessage("Invalid credentials or not authorized.");
        setToastType("error");
        setShowToast(true);
        setLoading(false);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      setToastMessage("Error connecting to the server. Please try again.");
      setToastType("error");
      setShowToast(true);
      setLoading(false);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen relative">
      {showToast && (
        <div
          className={`${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded-md fixed bottom-4 right-4 shadow-lg transition-transform transition-opacity duration-500 ease-out transform ${
            showToast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="flex justify-center items-center py-3">
        <Image alt="Logo" src={Logo} height={100} />
      </div>

      <div className="border border-gray-300 m-4 px-6 py-8 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Log in</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="idNumber" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-gray-300"
            required
          />

          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 mb-6 w-full rounded-[0.35rem] border-gray-300"
            required
          />

          <button
            type="submit"
            className="w-full p-2 mb-4 bg-[black] text-white rounded-[0.35rem] flex items-center justify-center"
            disabled={loading}
          >
            Log in
            {loading && (
              <i className="bx bx-loader-alt bx-spin text-white ml-2"></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
