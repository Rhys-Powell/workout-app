import { useCallback, useEffect, useMemo, useState } from 'react';
import { RoutineExercise } from '../types/RoutineExercises';
import DataService from '../DataService';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Exercise } from '../types/Exercise';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Modal from '../components/Modal';
import { getContextItem } from '../helpers/getContextItem';
import './Routine.scoped.css';
import { useAuth0 } from '@auth0/auth0-react';
import tooltip from '../../metadata/tooltips.json';
import { Tooltip } from 'react-tooltip';
import { useSyncCurrentWorkout } from '../context/UseSyncCurrentWorkout';
import { Workout} from '../types/Workout';
import { useWorkoutContext } from '../context/UseWorkoutContextHook';

const typedErrors: Errors = errors;

export default function Routine() {
  const navigate = useNavigate();
  const location = useLocation();
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [selectorActive, setSelectorActive] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [options, setOptions] = useState<Exercise[]>([]);
  const [error, setError] = useState(false);
  // Calling useParams() creates a new object every time the component is rendered. If the params are declared dependencies of the useEffect below and not made refs, even if the values of the params don't change, the new object returned by useParams() is still seen as a change which will trigger the useEffect in an infinite loop.
  const params = useParams();
  const memoizedRoutineId = useMemo(() => params.routineId, [params.routineId]);
  const userId = getContextItem("currentUserId");
  
  const routineName = () => {
    const queryString = location.search;
    const params = new URLSearchParams(queryString);
    return params.get('routineName') as string;
  }

  const { getAccessTokenSilently } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const memoizedDataService = useMemo(() => DataService(), []);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const syncCurrentWorkout = useSyncCurrentWorkout(routineExercises, memoizedRoutineId?.toString() ?? '', routineName() ?? '');
  const { updateCurrentWorkout } = useWorkoutContext();

  useEffect(() => {
    async function getRoutineExercises() {
      const token = await memoizedGetAccessTokenSilently();
      try {
        const data: RoutineExercise[] = await memoizedDataService.getData(token, 
          'users/' + userId + '/routines/' + memoizedRoutineId + '/exercises',
          {
            includeDetails: 'true',
          },
        );
        setError(false);
        setIsDataFetched(true);
        return data;
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }

    getRoutineExercises().then((value) => setRoutineExercises(value ?? []));
  }, [memoizedDataService, memoizedGetAccessTokenSilently, memoizedRoutineId, userId]);

  useEffect(() => {
    syncCurrentWorkout;
  },[syncCurrentWorkout]);

  async function getExercises() {
    const token = await memoizedGetAccessTokenSilently();
    try {
      const data: Exercise[] = await memoizedDataService.getData(token, 'users/' + userId + '/exercises');
      return data;
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  async function addRoutineExercise(selectedId: number) {
    const token = await memoizedGetAccessTokenSilently();
    if (userId != null && selectedId > -1) {
      const exerciseId: string = selectedId.toString();
      try {
        const response = await memoizedDataService.postData(token, 
          'users/' + userId + '/routines/' + memoizedRoutineId+ '/exercises', { 'exerciseId': exerciseId }
        );
        setRoutineExercises((prevExercises) => [...prevExercises, response]);
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setError(false);
    } else {
      console.error('User ID is null or no exercise selected');
    }
  }

  async function removeRoutineExercise(exerciseId: number, routineExerciseId: number) {
    const token = await memoizedGetAccessTokenSilently();  
    if (userId != null) {
      try {
        await memoizedDataService.deleteData(token, 'users/' + userId + '/routines/' + memoizedRoutineId + '/exercises/' + exerciseId);
        setError(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setRoutineExercises((prevExercises) => prevExercises.filter((e) => e.id !== routineExerciseId));
      setError(false);
    } else {
      console.error('User ID is null');
    }
  }

  async function addWorkout() {
    const token = await memoizedGetAccessTokenSilently();
    if (userId != null) {
      try {
        const response = await memoizedDataService.postData(token, 'users/' + userId + '/workouts', {});
        return response;
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setError(false);
    } else {
      console.error('User ID is null');
    }
  }

  function populateSelectorList() {
    getExercises().then((data) => setOptions((data as Exercise[]) ?? []));
  }

  function handleSelectorChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newSelectedId: number = parseInt(event.target.value, 10);
    addRoutineExercise(newSelectedId);
    setSelectorActive(false);
  }

  async function handleSaveClick() {
    const itemsToUpdate: { ExerciseId: number; NewExerciseOrder: number; }[] = [];
    routineExercises.forEach((item) => {
      itemsToUpdate.unshift({"ExerciseId": item.exerciseId, "NewExerciseOrder": item.exerciseOrder});
    });
    const token = await memoizedGetAccessTokenSilently();
    memoizedDataService.patchData(token, 'users/' + userId + '/routines/' + memoizedRoutineId, undefined, 
      itemsToUpdate);
    setEditMode(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newItems = [...routineExercises];
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    newItems.forEach((item, index) => {
      item.exerciseOrder = index + 1; // Start from 1 instead of 0
    });
    setRoutineExercises(newItems);
  };

  function beginWorkout() {
    const sortedExercises = routineExercises.sort((a, b) => a.exerciseOrder - b.exerciseOrder);
    addWorkout()
      .then((data: Workout) => {
        updateCurrentWorkout(sortedExercises, routineName(), data?.id.toString())})
      .then(() => {
        const firstExerciseId = sortedExercises[0].exerciseId;
        navigate(`/users/${userId}/exercises/${firstExerciseId}`);
      }).catch(error => {
        console.error(error)
    });
  }

  return (
  <>
    {<h1>{routineName()}</h1>}
    {!editMode && (
      error ? <p>{typedErrors.FAIL_TO_FETCH}</p> 
      : !isDataFetched ? <p>Loading...</p> 
      : routineExercises.length === 0 ? <p>No exercises found</p> 
      : <>
          {[...routineExercises]
            .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
            .map((routineExercise) => (
              <div key={routineExercise.id}>
                <Link to={`/users/${userId}/exercises/${routineExercise.exercise.id}`}>
                  {routineExercise.exercise.name}
                </Link>
              </div>
            ))}
          
        </>
    )}
    {!editMode && isDataFetched &&
      <div className="tooltip-container">
        <button onClick={() => setEditMode(true)}>Edit</button>
        <button disabled={routineExercises.length < 1} data-tooltip-id="begin-workout-button-tooltip" onClick={() => beginWorkout()}>
            Begin workout
          </button>
        <Tooltip id="begin-workout-button-tooltip" className="tooltip" clickable content={routineExercises.length < 1 ? tooltip.BEGIN_WORKOUT_TOOLTIP : ''} place="bottom"/>  
      </div>
    }

    {editMode && (
      <>
        <DragDropContext
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="droppable-1">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                id="droppable-1"
              >
                {[...routineExercises]
                  .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
                  .map(
                    (routineExercise, index) => (
                      <Draggable key={routineExercise.id} draggableId={routineExercise.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="draggable-routineExercise"
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Link to={`/users/${userId}/exercises/${routineExercise.exercise.id}`}>
                              {routineExercise.exercise.name}
                            </Link>
                            <button
                              onClick={() => removeRoutineExercise(routineExercise.exercise.id, routineExercise.id)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ),
                    // }
                  )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {!selectorActive && (
          <button
            onClick={() => {
              setSelectorActive(true)
              populateSelectorList();
            }}
          >
            Add exercise
          </button>
        )}
        {selectorActive && (
          <Modal onClose={() => setSelectorActive(false)}>
            <label htmlFor="dropdown">Select an option:</label>
            <select id="dropdown" onChange={(event) => handleSelectorChange(event)}>
              <option value="-1"></option>
              {options
                .filter(
                  (option) => !routineExercises.some((routineExercise) => routineExercise.exercise.id === option.id),
                )
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
            </select>
          </Modal>
          )} 
        <button onClick={() => handleSaveClick()}>Save</button>
      </>
    )}
  </>
  );
};