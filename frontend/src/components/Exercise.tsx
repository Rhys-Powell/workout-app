import { useEffect, useMemo, useRef, useState } from 'react';
import ExerciseSets from './ExerciseSets';
import ExerciseHistory from './ExerciseHistory';
import Timer from './Timer';
import type { Exercise } from '../types/Exercise';
import { useParams } from 'react-router-dom';
import DataService from '../DataService';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { useAuth } from '../context/UseAuthHook';
import { useCurrentUser } from '../context/UseCurrentUserHook';

const typedErrors: Errors = errors;

export function Exercise() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const [exercise, setExercise] = useState<Exercise>();
  // Calling useCurrentUser()/useParams() creates a new object every time the component is rendered. If the params are declared dependencies of the useEffect below and not made refs, even if the values of the params don't change, the new object returned by useCurrentUser()/useParams() is still seen as a change which will trigger the useEffect in an infinite loop.
  const { currentUser }= useCurrentUser(); 
  const userId = currentUser?.id; 
  const userIdRef = useRef<string | undefined>(userId?.toString()); 
  const { exerciseId } = useParams();
  const exerciseIdRef = useRef(exerciseId);
  const { token } = useAuth();
  const dataService = useMemo(() => DataService(token), [token]);

  useEffect(() => {
    async function getExercise() {
      try {
        const data: Exercise = await dataService.getData('users/' + userIdRef.current + '/exercises/' + exerciseIdRef.current);
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
  }, [dataService]);

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
