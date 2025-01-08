import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam'; // Install with `npm install react-webcam`
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import homeIcon from '../assets/icons/scan_success/home.png'; // Import the home icon
import '../css/uploadFile.css';

const UploadFile = ({ goNext, goBack, goToMedInfo, setMedicineData }) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewImage, setPreviewImage] = useState(null); // State for the image preview
  const [predictedMedicine, setPredictedMedicine] = useState(''); // State to store predicted medicine name
  const [toggleMode, setToggleMode] = useState('Upload'); // State for the toggle mode
  const webcamRef = useRef(null); // Reference for the webcam

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the selected image
      setUploadStatus('Scanning...');
    }
  };

  const handleCaptureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPreviewImage(imageSrc); // Set the captured image as the preview
      setSelectedFile(dataURItoBlob(imageSrc)); // Convert data URI to Blob for uploading
      setUploadStatus('Captured image ready for scanning.');
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

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };


  const getMedicineInfo = async (medicineName) => {
    // Capitalize the first letter and make the rest lowercase
    const formattedMedicineName = medicineName.charAt(0).toUpperCase() + medicineName.slice(1).toLowerCase();
  
    try {
      const response = await fetch(`http://localhost:5000/medicine/${formattedMedicineName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicine info');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  

  
  const handleProceed = async () => {
    if (!predictedMedicine) {
      setUploadStatus('No predicted medicine to proceed with.');
      return;
    }
  
    try {
      const data = await getMedicineInfo(predictedMedicine);
      console.log(data); // Log fetched data to inspect its structure
      if (data) {
        // Set the medicine data and navigate to the next page
        setMedicineData(data); // Pass the data to the parent component
        goToMedInfo(predictedMedicine); // Navigate to the next page
      } else {
        setUploadStatus('No data found for this medicine.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setUploadStatus('Error fetching data.');
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

      <div className="proceed-viewinfo-button">
      <button
        className="viewinfo-button"
        onClick={handleProceed}
        disabled={!predictedMedicine}
      >
        <span>Proceed</span>
      </button>
      </div>
      

      <div className="image-display">
        <div className="title-display">
          <p>Preview Image</p>
        </div>

        <div className="main-container-image-display">
          {/* Container for the image preview or webcam */}
          <div className="container-image-display">
            {toggleMode === 'Camera' ? (
              previewImage ? (
                <img src={previewImage} alt="Captured" className="preview-img" />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="webcam-feed"
                />
              )
            ) : previewImage ? (
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
                    const mode = e.target.checked ? 'Camera' : 'Upload';
                    setToggleMode(mode);
                    if (mode === 'Upload') {
                      setPreviewImage(null); // Clear webcam feed
                    }
                  }}
                />
                <span className="slider">
                  <span className="toggle-text">{toggleMode}</span>
                </span>
              </label>
            </div>

            {/* Upload or Camera Button */}
            {toggleMode === 'Upload' ? (
              <>
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
              </>
            ) : (
              <button className="upload-button" onClick={handleCaptureImage}>
                <span>Capture</span>
              </button>
            )}
          </div>
        </div>

        {/* Div to scan the image */}
        <div className="scan-image-container" onClick={handleScanImage}>
          <span className="scan-image-text">Scan Image</span>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
