import React, { useState } from "react";
import "../css/medinfo.css";
import back from "../assets/icons/medinfo/back.png"; // Ensure the path is correct

const MedInfo = ({ goBackToUploadFile, goBackToSearchMed, medicineData, source }) => {
  const [activeButton, setActiveButton] = useState("info");

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  // Define the content dynamically based on activeButton
  const contentMap = {
    info: medicineData.info || medicineData.information,
    usage: medicineData.usage || medicineData.usage,
    complication: medicineData.complication || medicineData.compilation,
  };

  const headerTextMap = {
    info: "Information",
    usage: "Usage",
    complication: "Complication",
  };

  // Dynamic back button handler based on source
  const handleBackClick = () => {
    if (source === "upload") {
      goBackToUploadFile(); // Go back to the UploadFile page
    } else if (source === "search") {
      goBackToSearchMed(); // Go back to the SearchMed page
    }
  };

  return (
    <div className="dashboard">
      <div className="header-med">
        <button className="back-button" onClick={handleBackClick}>
          <img src={back} alt="Back" className="back-icon" />
        </button>

        <button className="medicine_name">
          <h2>Medicine Generic Name: </h2>
          <p>{medicineData.generic_name}</p>
        </button>
      </div>

      <div className="overall-container">
        <div className="information-container">
          <div className="header-container">
            <p>{headerTextMap[activeButton]}</p>
          </div>

          <div className="content-container">
            <p>{contentMap[activeButton]}</p>
          </div>

          <div className="buttons-container">
            <button
              id="info-button"
              className={`toggle-button ${activeButton === "info" ? "active" : ""}`}
              onClick={() => handleButtonClick("info")}
            >
              Information
            </button>
            <button
              id="usage-button"
              className={`toggle-button ${activeButton === "usage" ? "active" : ""}`}
              onClick={() => handleButtonClick("usage")}
            >
              Usage
            </button>
            <button
              id="complication-button"
              className={`toggle-button ${activeButton === "complication" ? "active" : ""}`}
              onClick={() => handleButtonClick("complication")}
            >
              Complication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedInfo;
