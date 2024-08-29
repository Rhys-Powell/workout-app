import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlay, faPlus, faStop } from '@fortawesome/free-solid-svg-icons';
import './Countdown.css';
import SetTimer from './SetTimer';

const defaultStartingCount = 120;

export default function Countdown() {
  const [count, setCount] = useState(defaultStartingCount);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [startingCount, setStartingCount] = useState(defaultStartingCount);
  const intervalRef = useRef(0);

  const formattedCount = (() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  function resetCountdown() {
    setCount(startingCount);
    setTimerStarted(false);
  }

  useEffect(() => {
    if (timerStarted) {
      intervalRef.current = window.setInterval(() => {
        if (count === 0) {
          alert('Countdown finished!');
          window.clearInterval(intervalRef.current);
          setTimerStarted(false);
        } else {
          setCount((prevCount) => prevCount - 1);
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

  function changeTimerDuration() {
    setTimerStarted(false);
    setShowTimerInput(!showTimerInput);
  }

  function handleCountChange(minutes: number, seconds: number) {
    const newStartingCount = minutes * 60 + seconds;
    setCount(newStartingCount);
    setStartingCount(newStartingCount);
    setShowTimerInput(false);
  }

  function incrementCount() {
    setCount((prevCount) => prevCount + 1);
    setStartingCount(count + 1);
  }

  function decrementCount() {
    setCount((prevCount) => prevCount - 1);
    setStartingCount(count - 1);
  }

  return (
    <>
      {showTimerInput ? (
        <SetTimer count={count} onValueChange={handleCountChange} />
      ) : (
        <div className="countdown">
          <button onClick={resetCountdown}>Reset</button>
          <button onClick={changeTimerDuration}>Choose duration</button>
          <button onClick={incrementCount}>
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </button>
          <p>{formattedCount}</p>
          <button onClick={decrementCount}>
            <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
          </button>
          <button onClick={startStopTimer}>
            {timerStarted ? <FontAwesomeIcon icon={faStop} /> : <FontAwesomeIcon icon={faPlay} />}
          </button>
        </div>
      )}
    </>
  );
}
