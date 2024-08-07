import { useState } from 'react';
import ExerciseSets from './ExerciseSets';
import ExerciseHistory from './ExerciseHistory';
import Timer from './Timer';

export function Exercise() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <TabSelector changeActiveTab={setActiveIndex} />
      <ExerciseSets isActive={activeIndex === 0} />
      <ExerciseHistory isActive={activeIndex === 1} />
      <Timer />
    </div>
  );
}

export function TabSelector({ changeActiveTab }: { changeActiveTab: (activeIndex: number) => void }) {
  function handleClick(activeIndex: number) {
    changeActiveTab(activeIndex);
  }

  return (
    <>
      <div>
        <button onClick={() => handleClick(0)}>Sets</button>
        <button onClick={() => handleClick(1)}>History</button>
      </div>
    </>
  );
}
