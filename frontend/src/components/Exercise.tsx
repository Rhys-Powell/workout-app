import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ExerciseSets from './ExerciseSets';
import ExerciseHistory from './ExerciseHistory';
import Timer from './Timer';
import type { Exercise } from '../types/Exercise';
import { useParams } from 'react-router-dom';
import DataService from '../DataService';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { useCurrentUser } from '../context/UseCurrentUserHook';
import { useAuth0 } from '@auth0/auth0-react';

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
  const { getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const dataService = useMemo(() => DataService(), []);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    async function getExercise() {
      const token = await memoizedGetAccessTokenSilently();
      try {
        const data: Exercise = await dataService.getData(token, 'users/' + userIdRef.current + '/exercises/' + exerciseIdRef.current);
        setError(false);
        setIsDataFetched(true);
        return data;
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    getExercise().then((value) => setExercise(value));
  }, [dataService, memoizedGetAccessTokenSilently]);

  return (
    <div>
      <TabSelector changeActiveTab={setActiveIndex} />
      { error ? <p>{typedErrors.FAIL_TO_FETCH}</p> 
        : isDataFetched ? <h1>{exercise?.name}</h1>
        : <p>Loading...</p> 
      }
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
