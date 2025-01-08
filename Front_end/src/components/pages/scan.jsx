// src/components/pages/scan_success.jsx
import React, { useRef, useState, useEffect } from 'react';
import '../css/scan.css';
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import Webcam from 'react-webcam'; // Import react-webcam
import resetIcon from '../assets/icons/scan_success/reset.png'; // Import reset icon
import proceedIcon from '../assets/icons/scan_success/proceed.png'; // Import proceed icon
import homeIcon from '../assets/icons/scan_success/home.png'; // Import the home icon

const Scan = ({ goNext, goBack }) => {
  const webcamRef = useRef(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    // Function to check if the webcam is ready
    const checkWebcamReady = () => {
      if (webcamRef.current) {
        setIsWebcamReady(true);
      }
    };

    checkWebcamReady();
  }, []);

  return (
    <div className="scan-success-dashboard">
      <div className="logo-container">
        <img src={logo} alt="Scanseta Logo" className="logo" />
      </div>
      <button className="home-button" onClick={goBack}>
        <img src={homeIcon} alt="Home" className="home-icon" />
      </button>
      <div className="image-container">
        <p className="instruction-text">
          Please place your prescription on the <br />scanner deck
        </p>
        <div className="container1">
          <div className="container2">
            <Webcam
              audio={false} // Disable audio
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className={`webcam ${isWebcamReady ? 'ready' : ''}`} // Add a class when webcam is ready
              onUserMedia={() => setIsWebcamReady(true)} // Set webcam ready when user media is available
              onUserMediaError={() => setIsWebcamReady(false)} // Set webcam not ready on error
            />
          </div>
          <div className="progress">
            <div className="progress-bar">
            </div>
            <p className="progress-text">Scanned successfully</p>
          </div>
        </div>
        <div className="scan-buttons">
          <button className="scan-button-small">
            <img src={resetIcon} alt="Reset" className="button-icon" />
          </button>


          <button className="scan-button-large" onClick={goNext}>
            <img src={proceedIcon} alt="Proceed" className="button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scan;
