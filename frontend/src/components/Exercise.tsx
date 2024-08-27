import { useEffect, useRef, useState } from 'react';
import ExerciseSets from './ExerciseSets';
import ExerciseHistory from './ExerciseHistory';
import Timer from './Timer';
import type { Exercise } from '../types/Exercise';
import { useParams } from 'react-router-dom';
import { getData } from '../DataService';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';

const typedErrors: Errors = errors;

export function Exercise() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const [exercise, setExercise] = useState<Exercise>();

  const { userId, exerciseId } = useParams();
  const userIdRef = useRef(userId);
  const exerciseIdRef = useRef(exerciseId);
  userIdRef.current = userId;
  exerciseIdRef.current = exerciseId;

  useEffect(() => {
    async function getExercise() {
      try {
        const data: Exercise = await getData('users/' + userIdRef.current + '/exercises/' + exerciseIdRef.current);
        setError(false);
        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch data:', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
    }

    getExercise().then((value) => setExercise(value));
  }, []);

  return (
    <div>
      <TabSelector changeActiveTab={setActiveIndex} />
      <h1>{error ? typedErrors.FAIL_TO_FETCH : exercise?.name}</h1>
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
