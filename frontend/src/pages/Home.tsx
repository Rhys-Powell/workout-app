import * as DataService from '../DataService';
import { Exercise } from '../types/Exercise';
import { useState } from 'react';

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  async function handleClick() {
    setExercises(await DataService.fetchData());
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClick}>Get exercises</button>
      {exercises.map((exercise) => (
        <ul key={exercise.id}>{exercise.name}</ul>
      ))}
    </div>
  );
}
