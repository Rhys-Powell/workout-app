import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

const defaultCountdownSecs = 120;
const maxCountSecs = 5999;

export default function Timer() {
  const [count, setCount] = useState(defaultCountdownSecs);
  const [timerStarted, setTimerStarted] = useState(false);
  const [mode, setMode] = useState('countDown');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startTimer = () => {
      if (mode === 'countUp') {
        intervalId = setInterval(() => {
          setCount((prevCount) => Math.min(prevCount + 1, maxCountSecs));
        }, 1000);
      }

      if (mode === 'countDown') {
        intervalId = setInterval(() => {
          setCount((prevCount) => Math.max(prevCount - 1, 0));
        }, 1000);
      }
    };

    if (timerStarted) {
      startTimer();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timerStarted, mode]);

  function startStopTimer() {
    setTimerStarted(!timerStarted);
  }

  function toggleMode() {
    setMode((prevMode) => {
      const newMode = prevMode === 'countDown' ? 'countUp' : 'countDown';
      resetTimer(newMode);
      return newMode;
    });
  }

  function resetTimer(mode: string) {
    mode === 'countDown' ? setCount(defaultCountdownSecs) : setCount(0);
    setTimerStarted(false);
  }

  const formattedCount = (() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  })();

  return (
    <div>
      <p>{mode == 'countDown' ? 'Countdown' : 'Stopwatch'}</p>
      <div>{formattedCount}</div>
      <button onClick={toggleMode}>Change mode</button>
      <button onClick={startStopTimer}>
        {timerStarted ? <FontAwesomeIcon icon={faStop} /> : <FontAwesomeIcon icon={faPlay} />}
      </button>
      <button onClick={() => resetTimer(mode)}>Reset</button>
    </div>
  );
}
