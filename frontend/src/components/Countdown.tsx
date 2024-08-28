import { useState, useEffect, useCallback, useRef } from 'react';
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

  const formattedCount = (() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  const resetCountdownRef = useRef<() => void>(() => {});

  const resetCountdown = useCallback(() => {
    setCount(startingCount);
    setTimerStarted(false);
  }, [startingCount]);

  resetCountdownRef.current = resetCountdown;

  useEffect(() => {
    let intervalId: number | NodeJS.Timeout;

    const startCountdown = () => {
      intervalId = setInterval(() => {
        if (count === 0) {
          alert('Countdown finished!');
          clearInterval(intervalId);
          setTimerStarted(false);
          resetCountdownRef.current();
        } else {
          setCount((prevCount) => prevCount - 1);
        }
      }, 1000);
    };

    if (timerStarted) {
      startCountdown();
    }

    return () => {
      clearInterval(intervalId);
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
  }

  function decrementCount() {
    setCount((prevCount) => prevCount - 1);
  }

  return (
    <>
      {showTimerInput ? (
        <SetTimer count={count} onValueChange={handleCountChange} />
      ) : (
        <div className="countdown">
          <button onClick={resetCountdown}>Reset</button>
          <button onClick={changeTimerDuration}>Set duration</button>
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
