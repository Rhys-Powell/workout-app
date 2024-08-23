import { useCallback, useEffect, useState } from 'react';
import { getData, postData, deleteData } from '../DataService';
import { Link, useParams } from 'react-router-dom';
import { Exercise } from '../types/Exercise';

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [input, setInput] = useState({ name: '' });
  const [createMode, setCreateMode] = useState(false);
  const urlParams = useParams();

  const getExercises = useCallback(async () => {
    try {
      const data: Exercise[] = await getData('users/' + urlParams.userId + '/exercises');
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [urlParams]);

  async function createExercise() {
    if (urlParams.userId != null) {
      try {
        await postData('users/' + urlParams.userId + '/exercises', { userId: urlParams.userId, name: input.name });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User ID is null');
      setCreateMode(false);
    }
  }

  async function deleteExercise(exerciseId: number) {
    if (urlParams.userId != null) {
      try {
        await deleteData('users/' + urlParams.userId + '/exercises/' + exerciseId);
        setExercises((prevExercises) => prevExercises.filter((e) => e.id !== exerciseId));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User ID is null');
    }
  }

  useEffect(() => {
    getExercises().then((value) => setExercises(value ?? []));
  }, [getExercises]);

  function changeMode() {
    setCreateMode(true);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  }

  function handleSubmit() {
    if (input.name !== '') {
      createExercise();
    }
  }

  return (
    <>
      {exercises.length === 0 ? <p>No exercises found</p> : null}
      {exercises.map((exercise) => (
        <div key={exercise.id}>
          <Link to={`${exercise.id}`}>{exercise.name}</Link>
          <button onClick={() => deleteExercise(exercise.id)}>Delete</button>
        </div>
      ))}
      {createMode ? null : <button onClick={changeMode}>Add Exercise</button>}
      {createMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Exercise Name:
            <input type="string" name="name" onChange={handleInput} />
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setCreateMode(false)}>
            Cancel
          </button>
        </form>
      ) : null}
    </>
  );
}
