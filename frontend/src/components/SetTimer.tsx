import { useState } from 'react';

interface SetTimerProps {
  count: number;
  onValueChange: (minutes: number, seconds: number) => void;
}

export default function SetTimer({ count, onValueChange }: SetTimerProps) {
  const [minutes, setMinutes] = useState(Math.floor(count / 60));
  const [seconds, setSeconds] = useState(count % 60);

  function handleValueChange() {
    onValueChange(minutes, seconds);
  }

  return (
    <>
      <label htmlFor="minutes">Minutes</label>
      <input
        name="minutes"
        type="number"
        value={minutes}
        min="0"
        max="99"
        onChange={(e) => setMinutes(parseInt(e.target.value))}
      ></input>
      <span>:</span>
      <label htmlFor="seconds">Seconds</label>
      <input
        name="seconds"
        type="number"
        value={seconds}
        min="0"
        max="59"
        onChange={(e) => setSeconds(parseInt(e.target.value))}
      ></input>
      <button onClick={handleValueChange}>Set</button>
    </>
  );
}
