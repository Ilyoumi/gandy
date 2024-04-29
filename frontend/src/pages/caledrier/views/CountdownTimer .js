import React, { useState, useEffect } from "react";

const CountdownTimer = ({ appointmentId,onDelete  } ) => {
  const initialMinutes = parseInt(localStorage.getItem(`timerMinutes_${appointmentId}`)) || 1; 
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(intervalId);
										if (typeof onTimerFinish === 'function') {
											onDelete(); 
									}else{
										console.log("typeof onTimerFinish", typeof onTimerFinish)
									}
        } else {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        }
      } else {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }

      setIsFlashing((prevIsFlashing) => !prevIsFlashing);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [minutes, seconds,onDelete,appointmentId])

  useEffect(() => {
    localStorage.setItem("timerMinutes", minutes.toString());
  }, [minutes]);

  return (
    <div className={`countdown-timer ${isFlashing ? "flash-animation" : ""}`} style={{ color: "#FFC100", fontSize:"13px", fontWeight:"bold", position:"relative", left:"60%" }}>
      {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} s
    </div>
  );
};

export default CountdownTimer;
