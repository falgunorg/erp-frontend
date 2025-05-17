import React, { useState, useEffect } from "react";

const IntlDateTime = () => {
  const [dhkTime, setDhkTime] = useState("");
  const [nycTime, setNycTime] = useState("");

  // Function to get the current date and time in a specific time zone
  const getDateTimeInZone = (timeZone) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date());
  };

  // Update the times every second
  useEffect(() => {
    const updateTimes = () => {
      setDhkTime(getDateTimeInZone("Asia/Dhaka"));
      setNycTime(getDateTimeInZone("America/New_York"));
    };

    updateTimes(); // Set initial time
    const intervalId = setInterval(updateTimes, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return (
    <div className="date_time me-2">
      <b> DHK {dhkTime}</b>
      <br />
      NYC {nycTime}
    </div>
  );
};

export default IntlDateTime;
