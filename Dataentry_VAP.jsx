import React, { useState, useContext } from "react";
import "./Dataentry.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Home/Navbar";
import HeartRateButton from "./HeartRateButton";
import BodyTemperatureSlider from "./BodyTemperatureButton";
import SPO2Slider from "./SPO2Button";
import SystolicBPSlider from "./SystolicBPButton";
import DiastolicBPSlider from "./DiastolicBPButton";
import Infobutton from "../Infobutton/Infobutton";
import RespiratoryRateButton from "./RespiratoryRateButton";
import Panel from "../Home/Panel";
import axios from "axios";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosInstance from "../Axios/Axios";
import api from "../Axios/Api_flask";

function Dataentry() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [bodyTemp, setBodyTemp] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [spo2Value, setSpo2Value] = useState("");
  const [systolicBP, setSystolicBP] = useState("");
  const [diastolicBP, setDiastolicBP] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [respRate, setRespRate] = useState("");
  const [medication, setMedication] = useState("");

  const [predictionTextVAP, setPredictionTextVAP] = useState("");


  const submitVal = async (e) => {
    e.preventDefault();

    const formData = {
      patientId,
      appointmentDate,
      appointmentTime,
      heartRate,
      diastolicBP,
      systolicBP,
      bodyTemp,
      spo2Value,
      respRate,
      medication,
    };
    const dataToSubmit = {
      ...formData,
      medication: formData.medication === "" ? null : formData.medication,
    };

    try {
      const response = await AxiosInstance.post(
        "patientsrecordlist/",
        dataToSubmit
      );
      console.log("Data submitted successfully:", response.data);
      alert("Data submitted successfully");
      fetchPredictionData();
    } catch (error) {
      if (error.response) {
        console.error("Error submitting data:", error.response.data);
        alert("Failed to submit data: " + error.response.data.detail);
      } else {
        console.error("Error submitting data:", error.message);
        alert("Failed to submit data: " + error.message);
      }
    }
  };
  const fetchPredictionData = () => {
    const data = {
      patientName,
      patientId,
      doctorName,
      appointmentDate,
      appointmentTime,
      heartRate,
      diastolicBP,
      systolicBP,
      bodyTemp,
      spo2Value,
      respRate,
    };

    api
      .post("/predict", data)
      .then((response) => {
        const data = response.data;
        setPredictionTextVAP(data["VAP likelihood"]);

        if (data["VAP likelihood"] !== 0) {
          showNotification("VAP", data["VAP likelihood"]);
        }
      })
      .catch((error) => {
        console.error("Error fetching prediction:", error);
      });
  };

  const showNotification = (category, likelihood) => {
    const notificationMessage = getNotificationMessage(category, likelihood);
    toast.info(notificationMessage, {
      autoClose: 10000, // 5 seconds
      className: "custom-toast",
    });
  };

  const getNotificationMessage = (category, likelihood) => {
    if (likelihood === 0) {
      return `${category} prediction not yet available.`;
    } else if (likelihood < 0.5) {
      return `No  ${category}.`;
    } else if (likelihood >= 0.5 && likelihood < 0.75) {
      return `High Possibility of ${category}.`;
    } else if (likelihood >= 0.75 && likelihood < 0.95) {
      return `Special Attention ${category}.`;
    } else {
      return ` very High ${category} risk. Attention needed.`;
    }
  };
  const medicationsList = [
    "Ceftriaxone",
    "Cefepime",
    "Meropenem",
    "Piperacillin/tazobactam",
    "Ciprofloxacin",
    "Levofloxacin",
    "Vancomycin",
    "Linezolid",
    "Tigecycline",
  ];

  const cancelVal = (e) => {
    e.preventDefault();
    alert("Your data won't be saved anymore");
    navigate("/home");
  };
  const getheartRate = (data) => {
    setHeartRate(data);
  };

  const getbodyTemp = (data) => {
    setBodyTemp(data);
  };
  const getdiastolicBP = (data) => {
    setDiastolicBP(data);
  };
  const getspo2Value = (data) => {
    setSpo2Value(data);
  };
  const getsystolicBP = (data) => {
    setSystolicBP(data);
  };
  const getRespRate = (data) => {
    setRespRate(data);
  };
  const handlePatientSelect = (patient) => {
    setPatientId(patient.patientId);
    setPatientName(patient.patientName);
    setDoctorName(patient.doctorName);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 font-roboto">
        <div className="space-y-12 mr-5 ml-5">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex flex-row justify-between">
              <h1 className="text-base font-extrabold mt-2 leading-7 text-gray-900">
                PATIENT VITALS ENTRY PAGE
              </h1>
            </div>
            <p className="text-sm leading-6 text-gray-800">
              This Information will be Confidential
            </p>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Patient ID */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="username"
                  className="block font-semibold leading-6 text-gray-900"
                >
                  Patient ID{" "}
                  <Infobutton
                    message={`-Enter the id of patient
                 -ex : 12345678`}
                  />
                </label>
                <div className="mt-2">
                  <Panel onPatientSelect={handlePatientSelect} />
                </div>
              </div>
              {/* Patient Name */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block font-semibold leading-6 text-gray-900"
                >
                  Patient Name
                  <Infobutton
                    message={`Enter the name of patient
                   -ex: Aarav Sharma`}
                  />
                </label>
                <div className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-900 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block flex-1 border-0 bg-transparent p-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {/* Doctor's Name Input */}
            <div className="col-span-1 p-4 rounded-xl shadow-lg">
              <label
                htmlFor="doctor_name"
                className="block font-semibold leading-6 text-gray-900"
              >
                Doctor's Name{" "}
                <Infobutton message="Enter the name of doctor under whom the patient is being supervised -ex: Dr. Vivek Patel" />
              </label>
              <div className="mt-2 font-bold">
                <input
                  id="doctor_name"
                  name="doctor_name"
                  type="text"
                  className="ent_clr block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter Doctor's Name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date of Entry Input */}
            <div className="col-span-1 p-4 rounded-xl shadow-lg">
              <label
                htmlFor="appointment_date"
                className="block font-semibold leading-6 text-gray-900"
              >
                Date of Entry{" "}
                <Infobutton message="Enter the Date of entry of vitals signs by selecting in given calendar" />
              </label>
              <div className="mt-2">
                <input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  className="ent_clr block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Time of Entry Input */}
            <div className="col-span-1 p-4 rounded-xl shadow-lg">
              <label
                htmlFor="appointment_time"
                className="block font-semibold leading-6 text-gray-900"
              >
                Time of Entry{" "}
                <Infobutton message="Enter the Time of entry of vitals signs" />
              </label>
              <div className="mt-2">
                <input
                  id="appointment_time"
                  name="appointment_time"
                  type="time"
                  className="ent_clr block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* HeartRateSlider Component */}
            <div className="col-span-1">
              <HeartRateButton getheartRate={getheartRate} />
            </div>

            {/* BodyTemperatureSlider Component */}
            <div className="col-span-1">
              <BodyTemperatureSlider getbodyTemp={getbodyTemp} />
            </div>

            {/* SPO2Slider Component */}
            <div className="col-span-1">
              <SPO2Slider getspo2Value={getspo2Value} />
            </div>

            {/* SystolicBPSlider Component */}
            <div className="col-span-1">
              <SystolicBPSlider getsystolicBP={getsystolicBP} />
            </div>

            {/* DiastolicBPSlider Component */}
            <div className="col-span-1">
              <DiastolicBPSlider getdiastolicBP={getdiastolicBP} />
            </div>
            <div className="col-span-1">
              <RespiratoryRateButton getRespRate={getRespRate} />{" "}
              {/* Use the new component */}
            </div>
            <div className="col-span-1 p-4 rounded-xl shadow-lg">
              <label
                htmlFor="medication"
                className="block font-semibold text-lg leading-6 text-gray-900"
              >
                Medication <Infobutton message="Select Medicines" />
              </label>
              <div className="mt-2 font-bold">
                {/* <input
                  id="doctor_name"
                  name="medication"
                  type="text"
                  className="ent_clr block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter Medications"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  
                /> */}
                <select
                  id="medication"
                  name="medication"
                  className="block flex-1 border-0 bg-transparent p-1.5 pl-1 pt-4 shadow-lg border-hidden rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    --Select Medication--
                  </option>
                  {medicationsList.map((med, index) => (
                    <option key={index} value={med}>
                      {med}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="col-span-1 p-4 rounded-xl shadow-lg bg-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM9 12a1 1 0 10-2 0 1 1 0 002 0zm2-1a1 1 0 100-2 1 1 0 000 2zM2 8a6 6 0 0110.937-3.498 8.002 8.002 0 00-8.82 9.264A5.978 5.978 0 012 8zm6 7a4 4 0 11-2-7.465A8.01 8.01 0 0010 15a4 4 0 01-2 7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    VAP Prediction
                  </h3>
                  {/* <p className="mt-1 text-sm leading-6 text-gray-800">
                    {predictionTextVAP}
                  </p> */}
                  {predictionTextVAP == 0 ? (
                    <p className="mt-1 text-lg  leading-6 text-gray-800">
                      Not yet predicted
                    </p>
                  ) : predictionTextVAP < 0.5 ? (
                    <p className="mt-1 text-lg  leading-6 text-gray-800">
                      No VAP({predictionTextVAP})
                    </p>
                  ) : predictionTextVAP >= 0.5 &&
                    predictionTextVAP < 0.75 ? (
                    <p className="mt-1 text-lg  leading-6 text-gray-800">
                      Medium VAP({predictionTextVAP})
                    </p>
                  ) : (
                    <p className="mt-1 text-lg text-red-700">
                      <br />
                      Need Attention High VAP({predictionTextVAP})
                    </p>
                  )}
                </div>
              </div>
            </div>

          <div className="mt-8 flex justify-center items-center space-x-6">
            <button
              type="button"
              className="rounded-md bg-red-600 m-5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              onClick={cancelVal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-green-600 m-5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              onClick={submitVal}
            >
              Submit
            </button>
          </div>
        </div>

        <Footer />
        <ToastContainer />
      </div>
    </>
export default Dataentry;
