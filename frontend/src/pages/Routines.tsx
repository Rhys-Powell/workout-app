import { useEffect, useRef, useState } from 'react';
import { deleteData, getData, postData } from '../DataService';
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
  const { userId } = useParams();

  // Calling useParams() creates a new object every time the component is rendered. If the userId param is declared a dependency of the useEffect below and not made a ref, even if the value of userId doesn't change, the new object returned by useParams()is still seen as a change which will trigger the useEffect.
  const userIdRef = useRef<string | undefined>();
  userIdRef.current = userId;

  useEffect(() => {
    async function getRoutines() {
      try {
        const data: Routine[] = await getData('users/' + userIdRef.current + '/routines');
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
  }, []);

  async function createRoutine() {
    setCreateMode(false);
    if (userId != null) {
      try {
        const response = await postData('users/' + userId + '/routines', { userId: userId, name: input.name });
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
        await deleteData('users/' + userId + '/routines/' + routineId);
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
