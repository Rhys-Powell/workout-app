import { useCallback, useEffect, useMemo, useState } from 'react';
import ExerciseSets from './ExerciseSets';
import ExerciseHistory from './ExerciseHistory';
import Timer from './Timer';
import type { Exercise } from '../types/Exercise';
import { useParams } from 'react-router-dom';
import DataService from '../DataService';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { getContextItem } from '../helpers/getContextItem';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkoutContext } from '../context/UseWorkoutContextHook';
import { RoutineExercise } from '../types/RoutineExercises';
import WorkoutTrackerTitle from './WorkoutTrackerTitle';
import WorkoutNavButtons from './WorkoutNavButtons';
import './Exercise.scoped.css';

const typedErrors: Errors = errors;

export interface ExerciseProps {
    currentExerciseOrder: number | null 
    currentWorkoutExercises: RoutineExercise[] | []
    exercise: Exercise | undefined
    memoizedExerciseId: string | undefined
    userId: string
    workoutId: string | null
}

export function Exercise() {
  const { getCurrentWorkoutExercises, getCurrentWorkoutId } = useWorkoutContext();
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
  const [currentExerciseOrder, setCurrentExerciseOrder] = useState(-1);
  const currentWorkoutExercises: RoutineExercise[] = getCurrentWorkoutExercises();
  const workoutId: string | null = getCurrentWorkoutId();

  const props: ExerciseProps = { 
    currentExerciseOrder, 
    currentWorkoutExercises,
    exercise,
    memoizedExerciseId,
    userId,
    workoutId
  }

  useEffect(() => {
    const getExercise = async () => {
      const token = await memoizedGetAccessTokenSilently();
      try {
        await memoizedDataService.getData(token, 'users/' + userId + '/exercises/' + memoizedExerciseId)
        .then((data: Exercise) => {
          setError(false);
          setIsDataFetched(true);
          setExercise(data);
        });
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    getExercise();
  }, [memoizedDataService, memoizedExerciseId, memoizedGetAccessTokenSilently, userId]);

  //Get the exerciseOrder for the current exercise in the workout
  useEffect(() => {
    const currentExercise = currentWorkoutExercises.find((routineExercise) => routineExercise.exerciseId.toString() === memoizedExerciseId);
      if (currentExercise) {
        setCurrentExerciseOrder(currentExercise.exerciseOrder);
      }
    }, [currentWorkoutExercises, memoizedExerciseId] );

  return (
    <div>
      <TabSelector activeIndex={activeIndex} changeActiveTab={setActiveIndex} />
      <div>
        { error ? <p>{typedErrors.FAIL_TO_FETCH}</p> 
          : !isDataFetched ? <p>Loading...</p> 
          : currentExerciseOrder === -1 ? <h1>{exercise?.name}</h1>
          : <WorkoutTrackerTitle {...props}/>
        }
         {currentExerciseOrder !== -1 && 
          <WorkoutNavButtons {...props}/>
        }
        <ExerciseSets isActive={activeIndex === 0} {...props}/>
        <ExerciseHistory isActive={activeIndex === 1} />
        <Timer />
      </div>
    </div>
  );
}

export function TabSelector({ activeIndex, changeActiveTab }: { activeIndex: number, changeActiveTab: (activeIndex: number) => void }) {
  
  function handleClick(activeIndex: number) {
    changeActiveTab(activeIndex);
  }

  return (
    <div className="tab-container">
      <div role="tab" className={activeIndex === 0 ? "tab" : "inactive tab"} onClick={() => handleClick(0)} onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick(0);
        }
      }}
      tabIndex={0}>Sets</div>
      <div role="tab" className={activeIndex === 1 ? "tab" : "inactive tab"} onClick={() => handleClick(1)} onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick(1);
        }
      }}
      tabIndex={0}>History</div>
    </div>
  );
}
