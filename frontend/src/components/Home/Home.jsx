import React from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Realtime from "./Realtime";
import Panel from "./Panel";
import Infobutton from "../Infobutton/Infobutton";
import "./Home.css";
import Footer from "../Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ImgCol from "./ImgCol";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="font-roboto flex flex-col gap-8 home_page bg-gray-50 text-gray-700">
      <div className="shadow-md">
        <Navbar />
      </div>
      <ImgCol />

      {/* <div className="p-4">
        <p className="text-xl font-bold mb-2">Dashboard <Infobutton message={`This dashboard has info like:
- New Patients: It tells about new patients enrolled 
- Active Patients: It tells about the patients still active
- Total Patients: Total aptients number
- Visitors: New visitors numbers`}/></p>
        <Dashboard />
      </div> */}
      {/* <div className="p-4">
        <p className="text-xl font-bold mb-2">Disease Panel <Infobutton message={`This is disease panel with drop down to select disease.
          The health status button to go to disaese summary page`}/></p>
        <Panel />
      </div> */}
      {/* <div className="p-4">
        <p className="text-xl font-bold mb-2">Real Time Analysis <Infobutton message={`This has the real time graphs showing the vitals vs days line graph.
          -Heart beat
          -blood pressure
          -spo2
          -Temperature`}/></p>
        <Realtime />
      </div> */}
      <div className="p-4">
        <p className="text-xl font-bold mb-2">Your Personal Health Tracker</p>
        <p className="ml-2 text-gray-500 text-[16.5px]">
          Welcome to Charak’s Care Monitor, a sophisticated health tracker that
          revolutionizes well-being management. Our intuitive interface offers
          seamless real-time monitoring of key health metrics, including heart
          rate variability, blood pressure trends, and other vitals patterns.
          These insights enable informed decisions about health and lifestyle,
          promoting proactive health management. Charak’s Care Monitor
          facilitates data storage, allowing medical professionals to easily
          monitor patients. The user-friendly interface simplifies the recording
          and tracking of patient vitals. Additionally, it supports personalized
          goal-setting tailored to individual health objectives. Track progress
          effortlessly with detailed analytics and visual representations of
          health data over time. Whether aiming to improve cardiovascular
          fitness, manage stress, or enhance sleep hygiene, our app provides the
          tools and motivation to succeed.
          {/* <Realtime /> */}
        </p>
        <div className="flex flex-row align-baseline ml-2 mt-8">
          <div className="mt-6 text-gray-500 text-[16.5px] hidden sm:block">
            You can navigate to patients details:
          </div>
          <button
            className="font-bold bg-blue-600 text-white px-6 py-2 text-lg tracking-wider hover:bg-blue-700 rounded-lg transition duration-300 ease-in-out ml-2"
            onClick={() => navigate("/patients")}
          >
            Click Here to Know Patients Details
            <FontAwesomeIcon icon={faUpRightFromSquare} className="ml-2" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
