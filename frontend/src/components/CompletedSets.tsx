import { ExerciseSet } from "../types/ExerciseSet";
import { parseTimeSpan } from "../helpers/parseTimeSpan";
import { useWorkoutContext } from "../context/UseWorkoutContextHook";
import './CompletedSets.scoped.css';

export default function CompletedSets({ exerciseSets }: { exerciseSets: ExerciseSet[] | [] }) {

    const { getCurrentWorkoutId } = useWorkoutContext();
    
    return (
        <>
        { getCurrentWorkoutId() && (
            <div>
                <h2>Workout sets completed</h2>
                { exerciseSets.length === 0 && <p>None</p> }
                { exerciseSets.map((set) => {
                    const restTime = set.restTime ? parseTimeSpan(set.restTime) : null; 
                    const endTime = new Date(set.endTime);
                    const formattedEndTime = `${endTime.getDate().toString().padStart(2, '0')}-${(endTime.getMonth() + 1).toString().padStart(2, '0')}-${endTime.getFullYear()} ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                
                    return (
                        <div key={set.id} className="completed-set">
                            <p>Reps: {set.reps}</p>
                            <p>Weight: {set.weightKg}kg</p>
                            <p>Date completed: {formattedEndTime}</p>
                            {restTime !== null &&
                                <p>Rest Time: {restTime.minutes} minutes {restTime.seconds} seconds</p>
                            }
                        </div>
                    )
                })}
            </div>
        )}
        </>
    )   
}