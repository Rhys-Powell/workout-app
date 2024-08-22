import { useCallback, useEffect, useState } from 'react';
import { getData, postData } from '../DataService';
import { Routine } from '../types/Routine';
import { Link, useParams } from 'react-router-dom';

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [input, setInput] = useState({ name: '' });
  const urlParams = useParams();
  const [createMode, setCreateMode] = useState(false);

  const getRoutines = useCallback(async () => {
    try {
      const data: Routine[] = await getData('users/' + urlParams.userId + '/routines');
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [urlParams]);

  async function createRoutine() {
    if (urlParams.userId != null) {
      try {
        await postData('users/' + urlParams.userId + '/routines', { userId: urlParams.userId, name: input.name });
      } catch (error) {
        console.error(error);
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.name !== '') {
      createRoutine();
    }
  }

  return (
    <>
      {routines.map((routine) => (
        <div key={routine.id}>
          <Link to={`${routine.id}`}>{routine.name}</Link>
        </div>
      ))}

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
