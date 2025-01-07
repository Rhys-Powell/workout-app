import { useState } from 'react';
import Countdown from './Countdown';
import Stopwatch from './Stopwatch';
import './Timer.scoped.css';

export default function Timer() {
  const [mode, setMode] = useState('countDown');

  function toggleMode() {
    setMode((prevMode) => (prevMode === 'countDown' ? 'countUp' : 'countDown'));
  }

  return (
    <div className="timer">
      <div className="timer-header">
        <h2 className="timer-title">{mode === 'countDown' ? 'Countdown' : 'Stopwatch'}</h2>
        <button className="change-mode-button" onClick={toggleMode}>Switch mode</button>
      </div>
      {mode === 'countDown' ? <Countdown /> : <Stopwatch />}
    </div>
  );
}
