import { useEffect, useRef, useState } from 'react';
import { getData, postData, deleteData } from '../DataService';
import { Link, useParams } from 'react-router-dom';
import { Exercise } from '../types/Exercise';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';

const typedErrors: Errors = errors;

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [input, setInput] = useState({ name: '' });
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState(false);
  const { userId } = useParams();

  // Calling useParams() creates a new object every time the component is rendered. If the userId param is declared a dependency of the useEffect below and not made a ref, even if the value of userId doesn't change, the new object returned by useParams()is still seen as a change which will trigger the useEffect.
  const userIdRef = useRef<string | undefined>();
  userIdRef.current = userId;

  useEffect(() => {
    async function getExercises() {
      try {
        const data: Exercise[] = await getData('users/' + userIdRef.current + '/exercises');
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

    getExercises().then((value) => setExercises(value ?? []));
  }, []);

  async function createExercise() {
    setCreateMode(false);
    if (userId != null) {
      try {
        const response = await postData('users/' + userId + '/exercises', { userId: userId, name: input.name });
        setExercises((prevExercises) => [...prevExercises, response]);
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
      console.error('User ID is null');
    }
  }

  async function deleteExercise(exerciseId: number) {
    if (userId != null) {
      try {
        await deleteData('users/' + userId + '/exercises/' + exerciseId);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch data:', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
      setExercises((prevExercises) => prevExercises.filter((e) => e.id !== exerciseId));
      setError(false);
    } else {
      console.error('User ID is null');
    }
  }

  function changeMode() {
    setCreateMode(true);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (input.name !== '') {
      event.preventDefault();
      createExercise();
    }
  }

  return (
    <>
      {error && <p>{typedErrors.FAIL_TO_FETCH}</p>}
      {exercises.length === 0 && <p>No exercises found</p>}
      {exercises.map((exercise) => (
        <div key={exercise.id}>
          <Link to={`${exercise.id}`}>{exercise.name}</Link>
          <button onClick={() => deleteExercise(exercise.id)}>Delete</button>
        </div>
      ))}
      {!createMode && <button onClick={changeMode}>Create exercise</button>}
      {createMode && (
        <form onSubmit={(event) => handleSubmit(event)}>
          <label>
            Exercise Name:
            <input type="string" name="name" onChange={handleInput} />
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setCreateMode(false)}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
}
