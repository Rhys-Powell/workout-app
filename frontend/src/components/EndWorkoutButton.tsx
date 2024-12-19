import { useWorkoutContext } from "../context/UseWorkoutContextHook";

export default function EndWorkoutButton() {

    const { removeCurrentWorkout } = useWorkoutContext();

    return (
        <button onClick={() => { 
            removeCurrentWorkout();
            location.reload(); //This ensures all components are aware workout has ended in lieu of subscriptions to a centralized state
            }
        }>End workout</button> 
    )
}
