import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CountdownTimer = ({ appointmentId, onDelete }) => {
  // Get initial minutes from cookies if exists, otherwise set default
  const initialMinutes = parseInt(Cookies.get(`timerMinutes_${appointmentId}`)) || 1;
  const [timeLeft, setTimeLeft] = useState({ minutes: initialMinutes, seconds: 0 });
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        // Calculate new time left
        const newSeconds = prevTimeLeft.seconds - 1;
        const newMinutes = prevTimeLeft.minutes - (newSeconds < 0 ? 1 : 0);

        // Check if timer reached 0
        if (newMinutes === 0 && newSeconds === -1) {
          clearInterval(intervalId);
          if (onDelete) {
            onDelete();
          }
          return prevTimeLeft;
        }

        // Flash animation every second
        setIsFlashing(prevIsFlashing => !prevIsFlashing);

        // Return updated time left
        return {
          minutes: newMinutes >= 0 ? newMinutes : 0,
          seconds: newSeconds >= 0 ? newSeconds : 59
        };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onDelete, appointmentId]);

  useEffect(() => {
    // Set cookies to store timer minutes
    Cookies.set(`timerMinutes_${appointmentId}`, timeLeft.minutes.toString(), { expires: 7 }); // Expires in 7 days
  }, [timeLeft.minutes, appointmentId]);

  return (
    <div className={`countdown-timer ${isFlashing ? "flash-animation" : ""}`} style={{ color: "#FFC100", fontSize: "13px", fontWeight: "bold", position: "relative", left: "60%" }}>
      {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds} s
    </div>
  );
};

export default CountdownTimer;
