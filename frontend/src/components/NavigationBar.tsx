import { Link } from 'react-router-dom';
import './NavigationBar.scoped.css';
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';
import ResumeWorkoutButton from './ResumeWorkoutButton';
import { useCurrentUser } from '../context/UseCurrentUserHook';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkoutContext } from '../context/UseWorkoutContextHook';
import { useEffect, useState } from 'react';
import { RoutineExercise } from '../types/RoutineExercises';

export default function NavigationBar() {
  const { isAuthenticated } = useAuth0();
  const { getCurrentWorkoutExercises } = useWorkoutContext();
  const [currentWorkoutExercises, setCurrentWorkoutExercises] = useState<RoutineExercise[]>([]);
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const [ isOnWorkoutPage, setIsOnWorkoutPage ] = useState(false);

  useEffect(() => {
    const exercises = getCurrentWorkoutExercises();
    setCurrentWorkoutExercises(exercises)
  },[getCurrentWorkoutExercises]);
  
  useEffect(() => {
    const currentUrl = location.pathname;
    console.log("currentUrl", currentUrl);
    currentWorkoutExercises.forEach(exercise => {
      const url = `/users/${userId}/exercises/${exercise.exerciseId}`;
      console.log("url", url);
      if (url === currentUrl) {
        console.log("isOnWorkoutPage", isOnWorkoutPage);
        setIsOnWorkoutPage(true);
      } 
    })
    return () => {
      setIsOnWorkoutPage(false);
    };
  })

  return (
    <nav className="navigation-bar">
      <div className="navbar-item">
        <Link to="/">Home</Link>
      </div>
      <div className="navbar-item">
        <Link to="/profile">Profile</Link>
      </div>
      <div className="navbar-item">
        <Link to={`/users/${userId}/exercises`}>Exercises</Link>
      </div>
      <div className="navbar-item">
        <Link to={`/users/${userId}/routines`}>Routines</Link>
      </div>
      {currentWorkoutExercises.length > 0 && !isOnWorkoutPage &&
        <div className="navbar-item">
          <ResumeWorkoutButton url={`/users/${userId}/exercises/${currentWorkoutExercises[0].exerciseId}`} />
        </div>
      }
      {!isAuthenticated && (
        <div className="navbar-item">
          <LoginButton />
        </div>
      )}
      {!isAuthenticated && (
        <div className="navbar-item">
          <SignupButton />
        </div>
      )}
      {isAuthenticated && (
        <div className="navbar-item">
          <LogoutButton />
        </div>
      )}
    </nav>
  );
}
