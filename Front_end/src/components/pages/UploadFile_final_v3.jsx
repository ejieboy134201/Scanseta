import React, { useState } from 'react';
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import homeIcon from '../assets/icons/scan_success/home.png'; // Import the home icon
import uploadIcon from '../assets/icons/dashboard1/cloud-computing.png'; // Replace with your upload icon path
import '../css/uploadFile.css';

const UploadFile = ({ goBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewImage, setPreviewImage] = useState(null); // State for the image preview
  const [predictedMedicine, setPredictedMedicine] = useState(''); // State to store predicted medicine name
  const [toggleMode, setToggleMode] = useState('Upload Text'); // State for the toggle mode

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the selected image
      setUploadStatus('Scanning...');
    }
  };

  const handleScanImage = async () => {
    if (!selectedFile) {
      setUploadStatus('No image selected for scanning.');
      return;
    }

    // Send the image to the backend for processing
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/scan-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(result.message || 'Image scanned successfully!');
        setPredictedMedicine(result.predicted_class);
      } else {
        setUploadStatus(result.error || 'Failed to scan the image.');
      }
    } catch (error) {
      setUploadStatus('Error occurred while scanning the image.');
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <img src={logo} alt="Scanseta_Logo" className="logo" />
        <button className="home-button" onClick={goBack}>
          <img src={homeIcon} alt="Home" className="home-icon" />
        </button>
      </div>

      <div className="image-display">
        <div className="title-display">
          <p>Preview Image</p>
        </div>

        <div className="main-container-image-display">
          {/* Container for the image preview */}
          <div className="container-image-display">
            {previewImage ? (
              <img src={previewImage} alt="Selected" className="preview-img" />
            ) : (
              <p className="placeholder">No image selected.</p>
            )}
          </div>

          {/* Container for the status and predicted medicine */}
          <div className="status-image-display">
            <p className="predicted-medicine">
              Predicted Medicine: <strong>{predictedMedicine}</strong>
            </p>
          </div>
        </div>

        <div className="overall-buttons-container">
          <div className="choose-container">
            {/* Toggle Container */}

            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="toggle"
                  onChange={(e) => {
                    setToggleMode(e.target.checked ? 'Camera' : 'Upload');
                  }}
                />
                <span className="slider">
                  <span className="toggle-text">{toggleMode}</span>
                </span>
              </label>
            </div>
            <div className="middle-container">

            </div>

            <button
              className="upload-button"
              onClick={() => document.getElementById('file-input').click()}
            >
              <span>Upload</span>
            </button>
            <input
              type="file"
              id="file-input"
              className="file-input" // Hide the input element
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          


        </div>
        {/* Div to scan the image */}
        <div
          className="scan-image-container"
          onClick={handleScanImage}
        >
          <span className="scan-image-text">Scan Image</span>
        </div>
        
      </div>
    </div>
  );
};

export default UploadFile;
