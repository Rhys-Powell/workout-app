import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthHooks';
import { fetchData } from '../DataService';
import { Routine } from '../types/Routine';

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const auth = useAuth();

  const getRoutines = useCallback(async () => {
    const data: Routine[] = await fetchData('users/' + auth?.user?.id + '/routines');
    console.log(data);
    return data;
  }, [auth?.user?.id]);

  useEffect(() => {
    if (auth) {
      getRoutines().then((data) => setRoutines(data));
    }
  }, [auth, getRoutines]);

  return (
    <ul>
      {routines.map((routine) => (
        <li key={routine.id}>{routine.name}</li>
      ))}
    </ul>
  );
}
