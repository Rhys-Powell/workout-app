import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Exercise } from '../types/Exercise';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { useCurrentUser } from '../context/UseCurrentUserHook';
import DataService from '../DataService';
import { useAuth } from '../context/UseAuthHook';

const typedErrors: Errors = errors;

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [input, setInput] = useState({ name: '' });
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState(false);
   // Calling useCurrentUser() creates a new object every time the component is rendered. If the params are declared dependencies of the useEffect below and not made refs, even if the values of the params don't change, the new object returned by useCurrentUser()is still seen as a change which will trigger the useEffect in an infinite loop.
  const { currentUser }= useCurrentUser(); 
  const userId = currentUser?.id;
  const userIdRef = useRef<string | undefined>(userId?.toString()); 
  const { token } = useAuth();
  const dataService = useMemo(() => DataService(token), [token]);

  useEffect(() => {
    async function getExercises() {
      try {
        const response = await dataService.getData('users/' + userIdRef.current + '/exercises');
        setError(false);
        if (Array.isArray(response)) {
          return response;
        } else {
          console.error('Expected response to be an array');
        }
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch ', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
    }

    getExercises().then((value) => setExercises(value ?? []));
  }, [dataService]);

  async function createExercise() {
    setCreateMode(false);
    if (userId != null) {
      try {
        const response = await dataService.postData('users/' + userId.toString() + '/exercises', {}, { userId: userId.toString(), name: input.name });
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
        await dataService.deleteData('users/' + userId + '/exercises/' + exerciseId);
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
      {exercises.length === 0 ? <p>No exercises found</p> :
        exercises.map((exercise) => (
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
