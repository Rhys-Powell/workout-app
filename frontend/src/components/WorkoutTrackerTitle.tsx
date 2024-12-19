import { Exercise } from "../types/Exercise"
import { RoutineExercise } from "../types/RoutineExercises"
import { useWorkoutContext } from "../context/UseWorkoutContextHook"

interface Props {
    currentExerciseOrder: number | null,
    currentWorkoutExercises: RoutineExercise[] | [],
    exercise: Exercise | undefined
}

export default function WorkoutTrackerTitle(props: Props) {
   const {getCurrentWorkoutRoutineName} = useWorkoutContext(); 
    
    return (<>
        <p>{`Exercise ${props.currentExerciseOrder} of ${props.currentWorkoutExercises.length} in ${getCurrentWorkoutRoutineName()}`}</p>
        <h1>{props.exercise?.name}</h1>
    </>)
}
