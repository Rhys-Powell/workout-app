import { useCallback, useEffect, useState } from 'react';
import { getData, postData } from '../DataService';
import { Routine } from '../types/Routine';
import { Link, useParams } from 'react-router-dom';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';

const typedErrors: Errors = errors;

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [input, setInput] = useState({ name: '' });
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState(false);
  const urlParams = useParams();

  const getRoutines = useCallback(async () => {
    try {
      const data: Routine[] = await getData('users/' + urlParams.userId + '/routines');
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
  }, [urlParams]);

  async function createRoutine() {
    if (urlParams.userId != null) {
      try {
        await postData('users/' + urlParams.userId + '/routines', { userId: urlParams.userId, name: input.name });
        setError(false);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch data:', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
    } else {
      console.error('User ID is null');
      setCreateMode(false);
    }
  }

  useEffect(() => {
    getRoutines().then((value) => setRoutines(value ?? []));
  }, [getRoutines]);

  function handleClick() {
    setCreateMode(true);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  }

  function handleSubmit() {
    if (input.name !== '') {
      createRoutine();
    }
  }

  return (
    <>
      {error && <p>{typedErrors.FAIL_TO_FETCH}</p>}
      {routines.length === 0 && <p>No routines found</p>}
      {routines.map((routine) => (
        <div key={routine.id}>
          <Link to={`${routine.id}`}>{routine.name}</Link>
        </div>
      ))}
      {!createMode && <button onClick={handleClick}>Add Routine</button>}
      {createMode && (
        <form onSubmit={handleSubmit}>
          <label>
            Routine Name:
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
