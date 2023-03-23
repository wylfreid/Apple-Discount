import React, {useState, useEffect} from "react";
import '../../styles/clock.css'

const ClockVariant = ({stopTime}) => {

    const [days, setDays] = useState();
    const [hours, setHours] = useState();
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();


    let interval;

    const destination = new Date(stopTime).getTime();

    const countDown = () => {
        

        interval = setInterval(() => {
            const now = new Date().getTime();
            const different = destination - now;
            const days = Math.floor(different / (1000 * 60 * 60 *24));
            const hours = Math.floor(different % (1000 * 60 * 60 *24) /
            (1000 * 60 *60));

            const minutes = Math.floor(different % (1000 * 60 * 60)/
            (1000 * 60));

            const seconds = Math.floor(different % (1000 * 60) / 1000);
        
            if(destination < 0) clearInterval(interval.current)
            else{
                setDays(days);
                setHours(hours);
                setMinutes(minutes);
                setSeconds(seconds);
            }
        },1000)
    }

    useEffect(() => {
        countDown()
    })

  return (
    <div className="clock__wrapper d-flex align-items-center gap-3">
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-dark fs-3 mb-2">{days >= 0 ? days : 0} </h1>
          <h5 className="text-dark fs-6">Jours</h5>
        </div>
        <span className="text-dark fs-3">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-dark fs-3 mb-2">{hours >= 0 ? hours : 0} </h1>
          <h5 className="text-dark fs-6">Heures</h5>
        </div>
        <span className="text-dark fs-3">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-dark fs-3 mb-2">{minutes >= 0 ? minutes : 0} </h1>
          <h5 className="text-dark fs-6">Minutes</h5>
        </div>
        <span className="text-dark fs-3">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-dark fs-3 mb-2">{seconds >= 0 ? seconds : 0} </h1>
          <h5 className="text-dark fs-6">Secondes</h5>
        </div>
      </div>

    </div>
  );
};

export default ClockVariant;
