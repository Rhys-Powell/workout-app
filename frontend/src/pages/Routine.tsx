import { useCallback, useEffect, useState } from 'react';
import { RoutineExercise } from '../types/RoutineExercises';
import { deleteData, getData, postDataWithQueryString } from '../DataService';
import { useParams } from 'react-router-dom';
import { Exercise } from '../types/Exercise';

export default function Routine() {
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [selectorActive, setSelectorActive] = useState(false);
  const urlParams = useParams();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [options, setOptions] = useState<Exercise[]>([]);

  const getRoutineExercises = useCallback(async () => {
    try {
      const data: RoutineExercise[] = await getData(
        'users/' + urlParams.userId + '/routines/' + urlParams.routineId + '/exercises',
        {
          includeDetails: 'true',
        },
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [urlParams]);

  const getExercises = useCallback(async () => {
    try {
      const data: Exercise[] = await getData('users/' + urlParams.userId + '/exercises');
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [urlParams]);

  const addRoutineExercise = useCallback(async () => {
    if (urlParams.userId != null && selectedOption != null && selectedOption > -1) {
      try {
        await postDataWithQueryString('users/' + urlParams.userId + '/routines/' + urlParams.routineId + '/exercises', {
          exerciseId: selectedOption.toString(),
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User ID is null or no exercise selected');
    }
  }, [urlParams, selectedOption]);

  async function removeRoutineExercise(exerciseIdToRemove: number) {
    if (urlParams.userId != null) {
      try {
        await deleteData(
          'users/' + urlParams.userId + '/routines/' + urlParams.routineId + '/exercises/' + exerciseIdToRemove,
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User ID is null');
    }
  }

  useEffect(() => {
    getRoutineExercises().then((value) => setExercises(value ?? []));
  }, [getRoutineExercises]);

  useEffect(() => {
    if (selectedOption != null) {
      addRoutineExercise().then(() => setSelectedOption(null));
    }
  }, [addRoutineExercise, selectedOption]);

  function showSelector() {
    getExercises().then((data) => setOptions((data as Exercise[]) ?? []));
    setSelectorActive(true);
  }

  const handleSelectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedId: number = parseInt(event.target.value, 10);
    setSelectedOption(() => newSelectedId);
    setSelectorActive(false);
  };

  return (
    <>
      {exercises.length === 0 ? <p>No exercises found</p> : null}
      {[...exercises]
        .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
        .map((exercise) => (
          <div key={exercise.id}>
            {exercise.exercise.name}
            <button onClick={() => removeRoutineExercise(exercise.exercise.id)}>Remove</button>
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
          <select id="dropdown" value={selectedOption ?? -1} onChange={handleSelectorChange}>
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
