import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

const Map = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const center = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      {latitude && longitude && (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyDjDBfUBcNGmpnbHWSHuvgaWn0z66uIWJQ", 
          }}
          defaultCenter={center}
          defaultZoom={15}
        >
          {/* Marker for the specified location */}
          <Marker
            lat={latitude}
            lng={longitude}
            text={<i style={{fontSize:"20px"}} className="fas fa-location-arrow"></i>}
          />
        </GoogleMapReact>
      )}
    </div>
  );
};

// Marker component
const Marker = ({ text }) => <div style={{ color: "red" }}>{text}</div>;

export default Map;
