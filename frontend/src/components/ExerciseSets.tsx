import { useCallback, useState } from "react";
import DataService from "../DataService";
import { useAuth0 } from '@auth0/auth0-react';
import { getContextItem } from "../helpers/getContextItem";
import { useWorkoutContext } from "../context/UseWorkoutContextHook";
import { useParams } from "react-router-dom";

interface FormData {
  reps: number;
  weightKg: number; 
  restTimeMins: number;
  restTimeSecs: number;
  restTimeDuration: string;
}

export default function ExerciseSets({ isActive }: { isActive: boolean }) {
  const [ formData, setFormData ] = useState({
    reps: 0,
    weightKg: 0,
    restTimeMins: 0,
    restTimeSecs: 0,
    restTimeDuration: '' 
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const userId = getContextItem("currentUserId");
  const { getCurrentWorkoutId } = useWorkoutContext();
  const dataService = DataService();
  const params = useParams();
  const exerciseId = params.exerciseId;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const numericValue = Number(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: numericValue
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addSet(formData);
  }; 

  async function addSet(formData: FormData) {
    const token = await memoizedGetAccessTokenSilently();
    const currentWorkoutId = getCurrentWorkoutId();
    if (userId != null && currentWorkoutId != null && exerciseId != null) {
      try {
        await dataService.postData(token, 
          'users/' + userId + '/workouts/' + currentWorkoutId + '/exercises/' + exerciseId + '/sets', undefined, formData 
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('User ID, workout ID, or exercise ID is null');
    }
  }

  const handleRestTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const mins = name === 'restTimeMins' ? parseInt(value) : formData.restTimeMins;
    const secs = name === 'restTimeSecs' ? parseInt(value) : formData.restTimeSecs;
    if (validateRestTime(mins, secs)) {
      setIsInvalid(false);
      const restTimeDuration = `PT${mins}M${secs}S`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: Number(value),
        restTimeDuration
      }));
    } else {
      setIsInvalid(true);
      setFormData((prevFormData) => ({
        ...prevFormData, 
        [name]: Number(value) 
      }));
    }
  };
  
  const validateRestTime = (mins: number, secs: number) => {
    if (isNaN(mins) || isNaN(secs)) return false;
    if (mins < 0 || mins > 59) return false;
    if (secs < 0 || secs > 59) return false;
    return true;
  };

  return (
    <>
      <div>{isActive && <h2>Exercise Sets</h2>}</div>
      {getCurrentWorkoutId() && (
        <form onSubmit={handleSubmit} method="POST">
          <div>
            <label htmlFor="reps">Reps</label>
            <input type="number" name="reps" placeholder="Reps" min="1" value={formData.reps} onChange={handleChange}></input>
          </div>
          <div>  
            <label htmlFor="weightKg">Weight</label>
            <input type="number" name="weightKg" placeholder="Weight (kg)" min="0" value={formData.weightKg} onChange={handleChange}></input>
          </div>
          <div>
            <p>Rest Time</p>
            <label htmlFor="restTimeMins">Mins</label>
            <input type="number" name="restTimeMins" value={formData.restTimeMins} min="0" max="59"
            className={isInvalid ? 'invalid-input' : ''} onChange={handleRestTimeChange}></input>
            <label htmlFor="restTimeSecs">Secs</label>
            <input type="number" name="restTimeSecs" value={formData.restTimeSecs} min="0" max="59" 
            className={isInvalid ? 'invalid-input' : ''} onChange={handleRestTimeChange}></input>
          </div>
          <button disabled={isInvalid} type="submit">Finish set</button>
        </form>
      )}
    </>
  );
}
