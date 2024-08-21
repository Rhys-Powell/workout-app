import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthHooks';
import { getData, postData } from '../DataService';
import { Routine } from '../types/Routine';

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const auth = useAuth();
  const [input, setInput] = useState({ name: '' });
  const userId = auth?.user?.id;
  const [createMode, setCreateMode] = useState(false);

  const getRoutines = useCallback(async () => {
    try {
      const data: Routine[] = await getData('users/' + userId + '/routines');
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  async function createRoutine() {
    if (userId != null) {
      try {
        await postData('users/' + userId + '/routines', { userId: userId, name: input.name });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User ID is null');
      setCreateMode(false);
    }
  }

  useEffect(() => {
    if (auth && userId) {
      getRoutines().then((value) => setRoutines(value ?? []));
    }
  }, [auth, userId, getRoutines]);

  function handleClick() {
    setCreateMode(true);
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.name !== '') {
      createRoutine();
    }
  }

  return (
    <>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>{routine.name}</li>
        ))}
      </ul>
      {createMode ? null : <button onClick={handleClick}>Add Routine</button>}

      {createMode ? (
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
      ) : null}
    </>
  );
}
