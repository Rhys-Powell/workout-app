import { useCallback, useEffect, useMemo, useState } from 'react';
import ExerciseSets from './ExerciseSets';
import ExerciseHistory from './ExerciseHistory';
import Timer from './Timer';
import type { Exercise } from '../types/Exercise';
import { useNavigate, useParams } from 'react-router-dom';
import DataService from '../DataService';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { getContextItem } from '../helpers/getContextItem';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkoutContext } from '../context/UseWorkoutContextHook';
import { RoutineExercise } from '../types/RoutineExercises';

const typedErrors: Errors = errors;

export function Exercise() {
  const navigate = useNavigate();
  const { getCurrentWorkoutExercises, getCurrentWorkoutRoutineName } = useWorkoutContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(false);
  const [exercise, setExercise] = useState<Exercise>();
  // Calling useParams() creates a new object every time the component is rendered. If the params are declared direct dependencies of the useEffect below and not memoized, even if the values of the params don't change, the new object returned by useParams() is still seen as a change which will trigger the useEffect in an infinite loop.
  const params = useParams();
  const memoizedExerciseId = useMemo(() => params.exerciseId, [params.exerciseId]);
  const userId = getContextItem("currentUserId");
  const { getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const memoizedDataService = useMemo(() => DataService(), []);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [currentWorkoutExercises, setCurrentWorkoutExercises] = useState<RoutineExercise[] | []>([]);
  const [currentExerciseOrder, setCurrentExerciseOrder] = useState(-1);

  useEffect(() => {
    async function getExercise() {
      const token = await memoizedGetAccessTokenSilently();
      try {
        const data: Exercise = await memoizedDataService.getData(token, 'users/' + userId + '/exercises/' + memoizedExerciseId);
        setError(false);
        setIsDataFetched(true);
        return data;
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    getExercise().then((value) => setExercise(value));
  }, [memoizedDataService, memoizedExerciseId, memoizedGetAccessTokenSilently, userId]);

  useEffect(() => {
      const routineExercises = getCurrentWorkoutExercises();
      setCurrentWorkoutExercises(routineExercises);
      const currentExercise = routineExercises.find((routineExercise) => routineExercise.exerciseId.toString() === memoizedExerciseId);
      if (currentExercise) {
        setCurrentExerciseOrder(currentExercise.exerciseOrder);
      }
    }, [memoizedExerciseId, getCurrentWorkoutExercises]);

  function goToPrevExercise() {
    const prevExercises = currentWorkoutExercises.filter(exercise => exercise.exerciseOrder < currentExerciseOrder);
    if (prevExercises.length > 0) {
      const prevExercise = prevExercises.sort((a, b) => b.exerciseOrder - a.exerciseOrder)[0];
      navigate(`/users/${userId}/exercises/${prevExercise.exerciseId}`);
    }
  }

  function goToNextExercise() {
    const nextExercises = currentWorkoutExercises.filter(exercise => exercise.exerciseOrder > currentExerciseOrder);
    if (nextExercises.length > 0) {
      const nextExercise = nextExercises.sort((a, b) => a.exerciseOrder - b.exerciseOrder)[0];
      navigate(`/users/${userId}/exercises/${nextExercise.exerciseId}`);
    }
  }

  return (
    <div>
      <TabSelector changeActiveTab={setActiveIndex} />
      { error ? <p>{typedErrors.FAIL_TO_FETCH}</p> 
        : !isDataFetched ? <p>Loading...</p> 
        : currentExerciseOrder === -1 ? <h1>{exercise?.name}</h1>
        : (<>
              <p>{`Exercise ${currentExerciseOrder} of ${currentWorkoutExercises.length} in ${getCurrentWorkoutRoutineName()}`}</p>
            <h1>{exercise?.name}</h1>
          </>)
      }
      <ExerciseSets isActive={activeIndex === 0} />
      <ExerciseHistory isActive={activeIndex === 1} />
      {currentExerciseOrder !== -1 && (
        <>
          <button disabled={currentExerciseOrder <= 1} onClick={() => goToPrevExercise()}>Previous exercise</button>
          <button disabled={currentExerciseOrder >= currentWorkoutExercises.length} onClick={() => goToNextExercise()}>Next exercise</button>
        </>
      )}
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
