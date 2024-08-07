import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import './Stopwatch.css';

const maxSecs = 5999;

export default function Stopwatch() {
  const [count, setCount] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  const formattedCount = (() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  const resetStopwatchRef = useRef<() => void>(() => {});

  const resetStopwatch = useCallback(() => {
    setCount(0);
    setTimerStarted(false);
  }, []);

  resetStopwatchRef.current = resetStopwatch;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startStopwatch = () => {
      intervalId = setInterval(() => {
        if (count === maxSecs) {
          alert('Stopwatch finished!');
          clearInterval(intervalId);
          setTimerStarted(false);
          resetStopwatchRef.current();
        } else {
          setCount((prevCount) => prevCount + 1);
        }
      }, 1000);
    };

    if (timerStarted) {
      startStopwatch();
    }

    return () => {
      clearInterval(intervalId);
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
