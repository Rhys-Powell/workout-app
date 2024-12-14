import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Exercise } from '../types/Exercise';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { getContextItem } from '../helpers/getContextItem';
import DataService from '../DataService';
import { useAuth0 } from '@auth0/auth0-react';

const typedErrors: Errors = errors;

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [input, setInput] = useState({ name: '' });
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState(false);
  const userId = getContextItem("currentUserId");
  const { getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const memoizedDataService = useMemo(() => DataService(), []);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    async function getExercises() {
      const token = await memoizedGetAccessTokenSilently();
      try {
        const response = await memoizedDataService.getData(token, 'users/' + userId + '/exercises');
        setError(false);
        if (Array.isArray(response)) {
          setIsDataFetched(true);
          return response;
        } else {
          console.error('Expected response to be an array');
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    getExercises().then((value) => setExercises(value ?? []));
  }, [memoizedDataService, memoizedGetAccessTokenSilently, userId]);

  async function createExercise() {
    const token = await memoizedGetAccessTokenSilently();
    setCreateMode(false);
    if (userId != null) {
      try {
        const response = await memoizedDataService.postData(token, 'users/' + userId.toString() + '/exercises', {}, { userId: userId.toString(), name: input.name });
        setExercises((prevExercises) => [...prevExercises, response]);
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setError(false);
    } else {
      console.error('User ID is null');
    }
  }

  async function deleteExercise(exerciseId: number) {
    const token = await memoizedGetAccessTokenSilently();
    if (userId != null) {
      try {
        await memoizedDataService.deleteData(token, 'users/' + userId + '/exercises/' + exerciseId);
      } catch (error) {
        console.error(error);
        setError(true);
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
      {!createMode && (
        error ? <p>{typedErrors.FAIL_TO_FETCH}</p>
        : !isDataFetched ? <p>Loading...</p>
        : exercises.length === 0 ? <p>No exercises found</p> 
        :
        <> 
          {exercises.map((exercise) => (
            <div key={exercise.id}>
              <Link to={`${exercise.id}`}>{exercise.name}</Link>
              <button onClick={() => deleteExercise(exercise.id)}>Delete</button>
            </div>
          ))}
        </> 
      )}
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
