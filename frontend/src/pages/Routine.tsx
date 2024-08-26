import { useEffect, useRef, useState } from 'react';
import { RoutineExercise } from '../types/RoutineExercises';
import { deleteData, getData, postDataWithQueryString } from '../DataService';
import { Link, useParams } from 'react-router-dom';
import { Exercise } from '../types/Exercise';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';

const typedErrors: Errors = errors;

export default function Routine() {
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [selectorActive, setSelectorActive] = useState(false);
  const [options, setOptions] = useState<Exercise[]>([]);
  const [error, setError] = useState(false);
  const { userId, routineId } = useParams();

  // Calling useParams() creates a new object every time the component is rendered. If the params are declared dependencies of the useEffect below and not made refs, even if the values of the params don't change, the new object returned by useParams()is still seen as a change which will trigger the useEffect.
  const userIdRef = useRef<string | undefined>();
  const routineIdRef = useRef<string | undefined>();

  userIdRef.current = userId;
  routineIdRef.current = routineId;

  useEffect(() => {
    async function getRoutineExercises() {
      try {
        const data: RoutineExercise[] = await getData(
          'users/' + userIdRef.current + '/routines/' + routineIdRef.current + '/exercises',
          {
            includeDetails: 'true',
          },
        );
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

    getRoutineExercises().then((value) => setRoutineExercises(value ?? []));
  }, []);

  async function getExercises() {
    try {
      const data: Exercise[] = await getData('users/' + userId + '/exercises');
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

  async function addRoutineExercise(selectedId: number) {
    if (userIdRef.current != null && selectedId > -1) {
      try {
        const response = await postDataWithQueryString(
          'users/' + userIdRef.current + '/routines/' + routineIdRef.current + '/exercises',
          {
            exerciseId: selectedId.toString(),
          },
        );
        setRoutineExercises((prevExercises) => [...prevExercises, response]);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch data:', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
      setError(false);
    } else {
      console.error('User ID is null or no exercise selected');
    }
  }

  async function removeRoutineExercise(exerciseId: number, routineExerciseId: number) {
    if (userId != null) {
      try {
        await deleteData('users/' + userId + '/routines/' + routineId + '/exercises/' + exerciseId);
        setError(false);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch data:', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
      setRoutineExercises((prevExercises) => prevExercises.filter((e) => e.id !== routineExerciseId));
      setError(false);
    } else {
      console.error('User ID is null');
    }
  }

  function showSelector() {
    getExercises().then((data) => setOptions((data as Exercise[]) ?? []));
    setSelectorActive(true);
  }

  function handleSelectorChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newSelectedId: number = parseInt(event.target.value, 10);
    addRoutineExercise(newSelectedId);
    setSelectorActive(false);
  }

  return (
    <>
      {error && <p>{typedErrors.FAIL_TO_FETCH}</p>}
      {routineExercises.length === 0 ? <p>No exercises found</p> : null}
      {[...routineExercises]
        .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
        .map((routineExercise) => (
          <div key={routineExercise.id}>
            <Link to={`/users/${userId}/exercises/${routineExercise.exercise.id}`}>
              {routineExercise.exercise.name}
            </Link>
            <button onClick={() => removeRoutineExercise(routineExercise.exercise.id, routineExercise.id)}>
              Remove
            </button>
          </div>
        ))}
      {!selectorActive && (
        <button
          onClick={() => {
            showSelector();
          }}
        >
          Add exercise
        </button>
      )}
      {selectorActive && (
        <div>
          <label htmlFor="dropdown">Select an option:</label>
          <select id="dropdown" onChange={(event) => handleSelectorChange(event)}>
            <option value="-1"></option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
