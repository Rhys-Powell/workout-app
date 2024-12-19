import { Exercise } from "../types/Exercise"
import { RoutineExercise } from "../types/RoutineExercises"
import { getContextItem } from "../helpers/getContextItem"
import { useNavigate } from "react-router-dom"

interface Props {
    currentExerciseOrder: number | null,
    currentWorkoutExercises: RoutineExercise[] | [],
    exercise: Exercise | undefined, 
}

export default function WorkoutTrackerTitle(props: Props) {
   const userId = getContextItem("currentUserId"); 
   const navigate = useNavigate();
   
   function goToPrevExercise() {
        if (props.currentExerciseOrder !== null) {
            const prevExercises = props.currentWorkoutExercises.filter(exercise => exercise.exerciseOrder < props.currentExerciseOrder!);
            if (prevExercises.length > 0) {
                const prevExercise = prevExercises.sort((a, b) => b.exerciseOrder - a.exerciseOrder)[0];
                navigate(`/users/${userId}/exercises/${prevExercise.exerciseId}`);
            }
        } 
    }
   
    function goToNextExercise() {
        if (props.currentExerciseOrder !== null) {
            const nextExercises = props.currentWorkoutExercises.filter(exercise => exercise.exerciseOrder > props.currentExerciseOrder!);
            if (nextExercises.length > 0) {
                const nextExercise = nextExercises.sort((a, b) => a.exerciseOrder - b.exerciseOrder)[0];
                navigate(`/users/${userId}/exercises/${nextExercise.exerciseId}`);
            }
        }
    }

    return (
    <>
        {props.currentExerciseOrder !== null && ( 
            <>
                <button disabled={props.currentExerciseOrder! <= 1} onClick={() => goToPrevExercise()}>Previous exercise</button>
                <button disabled={props.currentExerciseOrder! >= props.currentWorkoutExercises.length} onClick={() => goToNextExercise()}>Next exercise</button>
            </>
        )}
    </>)
        
}
