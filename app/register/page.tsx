"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "../../components/SuccessModal";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  idNumber: string;
  yearLevel: string;
  section: string;
  tribu: string;
}

const SignupForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
    yearLevel: "",
    section: "",
    tribu: "",
  });

  const [tribes, setTribes] = useState<
    Array<{ tribu_id: string; tribu_name: string }>
  >([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchTribes() {
      try {
        const response = await axios.get(
          "http://localhost/attendance/user.php?action=fetchTribes"
        );
        setTribes(response.data);
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    }
    fetchTribes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          formData.firstName !== "" &&
          formData.lastName !== "" &&
          validateEmail(formData.email) &&
          formData.password !== "" &&
          formData.password === formData.confirmPassword
        );
      case 2:
        return (
          validateIdNumber(formData.idNumber) &&
          formData.yearLevel !== "" &&
          formData.section !== "" &&
          formData.tribu !== ""
        );
      default:
        return false;
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-z0-9._%+-]+@phinmaed\.com$/i;
    return emailRegex.test(email);
  };

  const validateIdNumber = (idNumber: string): boolean => {
    const idRegex = /^02-\d{4}-\d{5}$/;
    return idRegex.test(idNumber);
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection("right");
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setDirection("left");
    setStep(step - 1);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitForm = async () => {
    if (validateStep(2)) {
      try {
        const response = await axios.post(
          "http://localhost/attendance/user.php?action=register",
          formData
        );
        if (response.data && response.data.success) {
          setShowModal(true);
        } else if (response.data && response.data.error) {
          console.error("Error:", response.data.error);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Failed to submit the form:", error);
      }
    }
  };

  const slideClass =
    direction === "right" ? "animate-slide-right" : "animate-slide-left";

  const renderStepOne = () => (
    <div className={`flex justify-center items-center h-[100vh]`}>
      <div className="border border-[gray] m-4 px-2 py-4 rounded-xl w-[100%] max-w-md overflow-hidden">
        {renderStepIndicator()}
        <div className={`p-4 ${slideClass}`}>
          <h2 className="text-2xl font-bold mb-3">Register</h2>

          <div className="flex flex-1 gap-2">
            <div>
              <label htmlFor="firstName" className="block">
                First name<span className="text-[red]"> *</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block">
                Last name<span className="text-[red]"> *</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
                required
              />
            </div>
          </div>
          <label htmlFor="email">
            Email{" "}
            <span className="text-[gray] italic">
              (Please use your phinmaed account)
            </span>
            <span className="text-[red]"> *</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            placeholder="ex: judel.cruz.coc@phinmaed.com"
            required
          />

          <label htmlFor="password">
            Password<span className="text-[red]"> *</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password<span className="text-[red]"> *</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            required
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={toggleShowPassword}
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <div className="flex justify-between">
            <button
              onClick={nextStep}
              className={`w-full p-2 mt-4 ${
                validateStep(1)
                  ? "bg-[#277c49] text-white rounded-[0.35rem]"
                  : "bg-gray-400 cursor-not-allowed rounded-[0.35rem]"
              }`}
              disabled={!validateStep(1)}
            >
              Next
            </button>
          </div>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link href="/" className="font-bold cursor-pointer hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className={`flex justify-center items-center h-[100vh]`}>
      <div className="border border-[gray] m-4 px-2 py-7 rounded-xl w-[100%] max-w-md overflow-hidden">
        {renderStepIndicator()}
        <div className={`p-4 ${slideClass}`}>
          <h2 className="text-2xl font-bold mb-3">Additional Info</h2>
          <label htmlFor="idNumber">
            ID Number<span className="text-[red]"> *</span>
          </label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            placeholder="Format: 02-xxxx-xxxxx"
            required
          />

          <label htmlFor="yearLevel">
            Year Level<span className="text-[red]"> *</span>
          </label>
          <select
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            required
          >
            <option value="">Select Year Level</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <label htmlFor="section">
            Section<span className="text-[red]"> *</span>
          </label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            required
          />

          <label htmlFor="tribu">
            Tribu<span className="text-[red]"> *</span>
          </label>
          <select
            name="tribu"
            value={formData.tribu}
            onChange={handleChange}
            className="border p-2 mb-4 w-full rounded-[0.35rem] border-[gray]"
            required
          >
            <option value="">Select Tribu</option>
            {Array.isArray(tribes) &&
              tribes.map((tribe) => (
                <option key={tribe.tribu_id} value={tribe.tribu_id}>
                  {tribe.tribu_name}
                </option>
              ))}
          </select>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="w-1/3 p-2 mt-4 bg-gray-500 text-white rounded-[0.35rem]"
            >
              Back
            </button>
            <button
              onClick={submitForm}
              className={`w-1/3 p-2 mt-4 ${
                validateStep(2)
                  ? "bg-[#277c49] text-white rounded-[0.35rem]"
                  : "bg-gray-400 cursor-not-allowed rounded-[0.35rem]"
              }`}
              disabled={!validateStep(2)}
            >
              Submit
            </button>
          </div>
        </div>

        {showModal && <SuccessModal />}
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-4 w-full px-4 transition-all duration-500 ease-in-out">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? "bg-[#277c49]" : "bg-gray-200"
        } transition-all duration-500 ease-in-out`}
      >
        {step > 1 && (
          <span className="text-white">
            <i className="bx bx-check" />
          </span>
        )}
      </div>
      <div
        className={`flex-grow h-1 transition-all duration-500 ease-in-out ${
          step > 1 ? "bg-[#277c49]" : "bg-gray-200"
        } mx-2`}
      ></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
          step === 2 && !showModal ? "bg-[#277c49]" : "bg-gray-200"
        }`}
      >
        {showModal && (
          <span className="text-white">
            <i className="bx bx-check" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
    </div>
  );
};

export default SignupForm;
