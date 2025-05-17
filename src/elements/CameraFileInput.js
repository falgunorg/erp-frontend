import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

const CameraFileInput = ({ onFileChange }) => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const handleCameraAccess = async () => {
    try {
      setCapturedImage(null);
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = newStream;
      setStream(newStream);
      setCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-capture.png");
      onFileChange(file);
      setCapturedImage(URL.createObjectURL(file)); // Set the captured image for preview
      setCameraOpen(false); // Close the camera after capturing
    }, "image/png");
  };

  const handleOpenCameraAgain = async () => {
    setCapturedImage(null);
    setCameraOpen(true);

    if (stream) {
      // Stop the existing stream before reopening the camera
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = newStream;
      setStream(newStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <div className="camera-file-input-container">
      {capturedImage ? (
        <div className="captured-image-container">
          <Link onClick={handleOpenCameraAgain} className="btn btn-warning">
            Capture Again
          </Link>
          <div className="camera-preview">
            <img
              src={capturedImage}
              alt="Captured"
              className="captured-image"
            />
          </div>
        </div>
      ) : (
        <div className="camera-preview-container">
          {cameraOpen ? (
            <Link onClick={handleCapture} className="btn btn-success">
              Capture Photo
            </Link>
          ) : (
            <Link onClick={handleCameraAccess} className="btn btn-info">
              Open Camera
            </Link>
          )}

          <video
            ref={videoRef}
            className="camera-preview"
            autoPlay
            playsInline
            muted
          ></video>
        </div>
      )}
    </div>
  );
};

export default CameraFileInput;
