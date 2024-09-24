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
      <p>{mode === 'countDown' ? 'Countdown' : 'Stopwatch'}</p>
      {mode === 'countDown' ? <Countdown /> : <Stopwatch />}
      <button onClick={toggleMode}>Change mode</button>
    </div>
  );
}
