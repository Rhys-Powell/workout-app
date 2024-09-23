import { useEffect, useMemo, useRef, useState } from 'react';
import DataService from '../DataService';
import { Routine } from '../types/Routine';
import { Link } from 'react-router-dom';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { useAuth } from '../context/UseAuthHook';
import { useCurrentUser } from '../context/UseCurrentUserHook';

const typedErrors: Errors = errors;

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [input, setInput] = useState({ name: '' });
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState(false);
  // Calling useCurrentUser() creates a new object every time the component is rendered. If the params are declared dependencies of the useEffect below and not made refs, even if the values of the params don't change, the new object returned by useCurrentUser()is still seen as a change which will trigger the useEffect in an infinite loop.
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id; 
  const userIdRef = useRef<string | undefined>(userId?.toString()); 
  const { token } = useAuth();
  const dataService = useMemo(() => DataService(token), [token]);

  useEffect(() => {
    async function getRoutines() {
      try {
        const data: Routine[] = await dataService.getData('users/' + userIdRef.current + '/routines');
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

    getRoutines().then((value) => setRoutines(value ?? []));
  }, [dataService]);

  async function createRoutine() {
    setCreateMode(false);
    if (userId != null) {
      try {
        const response = await dataService.postData('users/' + userId + '/routines', { userId: userId, name: input.name });
        setRoutines((prevRoutines) => [...prevRoutines, response]);
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

  async function deleteRoutine(routineId: number) {
    if (userId != null) {
      try {
        await dataService.deleteData('users/' + userId + '/routines/' + routineId);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Failed to fetch data:', error);
          setError(true);
        } else {
          console.error(error);
        }
      }
      setRoutines((prevRoutines) => prevRoutines.filter((r) => r.id !== routineId));
      setError(false);
    } else {
      console.error('User ID is null');
    }
  }

  function handleClick() {
    setCreateMode(true);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (input.name !== '') {
      event.preventDefault();
      createRoutine();
    }
  }

  return (
    <>
      {error && <p>{typedErrors.FAIL_TO_FETCH}</p>}
      {routines.length === 0 ? <p>No routines found</p> :
        routines.map((routine) => (
          <div key={routine.id}>
            <Link to={`${routine.id}`}>{routine.name}</Link>
            <button onClick={() => deleteRoutine(routine.id)}>Delete</button>
          </div>
        ))
      }
      {!createMode && <button onClick={handleClick}>Create routine</button>}
      {createMode && (
        <form onSubmit={(event) => handleSubmit(event)}>
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
