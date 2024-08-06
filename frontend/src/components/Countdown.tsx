import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import './Countdown.css';
import SetTimer from './SetTimer';

const defaultCountdownSecs = 120;

export default function Countdown() {
  const [count, setCount] = useState(defaultCountdownSecs);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showTimerInput, setShowTimerInput] = useState(false);

  const formattedCount = (() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  const resetCountdownRef = useRef<() => void>(() => {});

  const resetCountdown = useCallback(() => {
    setCount(defaultCountdownSecs);
    setTimerStarted(false);
  }, []);

  resetCountdownRef.current = resetCountdown;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

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

  function setTimerDuration() {
    setTimerStarted(false);
    setShowTimerInput(!showTimerInput);
  }

  function handleCountChange(minutes: number, seconds: number) {
    setCount(minutes * 60 + seconds);
    setShowTimerInput(false);
  }

  return (
    <>
      {showTimerInput ? (
        <SetTimer count={count} onValueChange={handleCountChange} />
      ) : (
        <>
          <button onClick={startStopTimer}>
            {timerStarted ? <FontAwesomeIcon icon={faStop} /> : <FontAwesomeIcon icon={faPlay} />}
          </button>
          <button onClick={setTimerDuration}>Set duration</button>
          <div>{formattedCount}</div>
          <button onClick={resetCountdown}>Reset</button>
        </>
      )}
    </>
  );
}
