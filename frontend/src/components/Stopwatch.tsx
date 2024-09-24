import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import './Stopwatch.scoped.css';

const maxSecs = 5999;

export default function Stopwatch() {
  const [count, setCount] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const intervalRef = useRef(0);

  const formattedCount = (() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  function resetStopwatch() {
    setCount(0);
    setTimerStarted(false);
  }

  useEffect(() => {
    if (timerStarted) {
      intervalRef.current = window.setInterval(() => {
        if (count === maxSecs) {
          alert('Stopwatch finished!');
          window.clearInterval(intervalRef.current);
          setTimerStarted(false);
        } else {
          setCount((prevCount) => prevCount + 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [count, timerStarted]);

  function startStopTimer() {
    setTimerStarted(!timerStarted);
  }

  return (
    <div className="stopwatch">
      <button onClick={resetStopwatch}>Reset</button>
      <p>{formattedCount}</p>
      <button onClick={startStopTimer}>
        {timerStarted ? <FontAwesomeIcon icon={faStop} /> : <FontAwesomeIcon icon={faPlay} />}
      </button>
    </div>
  );
}
