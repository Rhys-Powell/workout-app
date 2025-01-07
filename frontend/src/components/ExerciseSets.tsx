import { useCallback, useEffect, useMemo, useState } from "react";
import DataService from "../DataService";
import { useAuth0 } from '@auth0/auth0-react';
import { ExerciseSet } from "../types/ExerciseSet";
import CompletedSets from "./CompletedSets";
import { ExerciseProps } from "./Exercise";
import './ExerciseSets.scoped.css';

interface FormData {
  reps: number;
  weightKg: number; 
  restTimeMins: number;
  restTimeSecs: number;
  restTimeDuration: string;
}

interface ExerciseSetProps extends ExerciseProps {
  isActive: boolean
}

export default function ExerciseSets({ isActive, ...props}: ExerciseSetProps) {
  const [ formData, setFormData ] = useState({
    reps: 0,
    weightKg: 0,
    restTimeMins: 0,
    restTimeSecs: 0,
    restTimeDuration: '' 
  });

  const { currentExerciseOrder, userId, memoizedExerciseId, workoutId } = props;

  const [isInvalid, setIsInvalid] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const memoizedDataService = useMemo(() => DataService(), []);
  const [exerciseSets , setExerciseSets] = useState<ExerciseSet[]>([]);

  useEffect(() => {
    const getSets = async () =>{
      const token = await memoizedGetAccessTokenSilently();
      if (workoutId != null) {
        try {
          await memoizedDataService.getData(token, 'users/' + userId + '/workouts/' + workoutId +'/exercises/' + memoizedExerciseId + '/sets'
          ).then((data: ExerciseSet[]) => {
            setExerciseSets(data);
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
    getSets();
  } , [memoizedExerciseId, memoizedGetAccessTokenSilently, userId, memoizedDataService, workoutId]);
  
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const numericValue = Number(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: numericValue
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await addSet(formData);
  }; 

  async function addSet(formData: FormData) {
    const token = await memoizedGetAccessTokenSilently();
    if (userId != null && workoutId != null && memoizedExerciseId != null) {
      try {
        const response = await memoizedDataService.postData(token, 
          'users/' + userId + '/workouts/' + workoutId + '/exercises/' + memoizedExerciseId + '/sets', undefined, formData 
        );
        setExerciseSets((prevSets) => [...prevSets, response]);
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
  }
  
  const validateRestTime = (mins: number, secs: number) => {
    if (isNaN(mins) || isNaN(secs)) return false;
    if (mins < 0 || mins > 59) return false;
    if (secs < 0 || secs > 59) return false;
    return true;
  };

  return (
    <>
      {isActive && currentExerciseOrder !== -1 && (
        <div >
          <h2>Exercise Sets</h2>
          <form onSubmit={handleSubmit} method="POST" className="exercise-sets-form">
            <div className="form-col">
              <div className="form-field">
                <label htmlFor="reps">Reps</label>
                <input type="number" name="reps" min="1" max="9999" value={formData.reps} onChange={handleChange}></input>
              </div>
              <div className="form-field">
                <label htmlFor="weightKg">Weight (kg)</label>
                <input type="number" name="weightKg" min="0" max="9999"value={formData.weightKg} onChange={handleChange}></input>
              </div>
             </div> 
            <div className="form-col">
              <p>Rest Time</p>
              <div className="form-field">
                <label htmlFor="restTimeMins">Minutes</label>
                <input type="number" name="restTimeMins" value={formData.restTimeMins} min="0" max="59"
                className={isInvalid ? 'invalid-input' : ''} onChange={handleRestTimeChange}></input>
              </div>
              <div className="form-field">
                <label htmlFor="restTimeSecs">Seconds</label>
                <input type="number" name="restTimeSecs" value={formData.restTimeSecs} min="0" max="59" 
                className={isInvalid ? 'invalid-input' : ''} onChange={handleRestTimeChange}></input>
              </div>
            </div>
            <button className="finish-set-button" disabled={isInvalid} type="submit">Finish set</button>
          </form>
          <CompletedSets exerciseSets={exerciseSets}/>
        </div>
      )}
    </>
  );
};
