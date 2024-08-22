import { useCallback, useEffect, useState } from 'react';
import { RoutineExercise } from '../types/RoutineExercises';
import { getData } from '../DataService';
import { useParams } from 'react-router-dom';

export default function Routine() {
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const urlParams = useParams();

  const getRoutineExercises = useCallback(async () => {
    try {
      const data: RoutineExercise[] = await getData(
        'users/' + urlParams.userId + '/routines/' + urlParams.routineId + '/Exercises',
        {
          includeDetails: 'true',
        },
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [urlParams]);

  useEffect(() => {
    getRoutineExercises().then((value) => setExercises(value ?? []));
  }, [getRoutineExercises]);

  return (
    <>
      {[...exercises]
        .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
        .map((exercise) => (
          <div key={exercise.id}>{exercise.exercise.name}</div>
        ))}
    </>
  );
}
