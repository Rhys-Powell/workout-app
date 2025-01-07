import { Link } from 'react-router-dom';
import './NavigationBar.scoped.css';
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';
import ResumeWorkoutButton from './ResumeWorkoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkoutContext } from '../context/UseWorkoutContextHook';
import { useEffect, useState } from 'react';
import { RoutineExercise } from '../types/RoutineExercises';
import { getContextItem } from '../helpers/getContextItem';
import EndWorkoutButton from './EndWorkoutButton';

export default function NavigationBar() {
  const { isAuthenticated } = useAuth0();
  const { getCurrentWorkoutExercises } = useWorkoutContext();
  const [currentWorkoutExercises, setCurrentWorkoutExercises] = useState<RoutineExercise[]>([]);
  const userId = getContextItem("currentUserId"); 
  const [ isOnWorkoutPage, setIsOnWorkoutPage ] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const exercises = getCurrentWorkoutExercises();
    setCurrentWorkoutExercises(exercises)
  },[getCurrentWorkoutExercises]);
  
  useEffect(() => {
    const currentUrl = location.pathname;
    currentWorkoutExercises.forEach(exercise => {
      const url = `/users/${userId}/exercises/${exercise.exerciseId}`;
      if (url === currentUrl) {
        setIsOnWorkoutPage(true);
      } 
    })
    return () => {
      setIsOnWorkoutPage(false);
    };
  })

  return (
    <nav className="navigation-bar">
      <button className="menu" onClick={() => {setMenuOpen(!menuOpen)}}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={menuOpen ? "menu-open" : ""}>
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="navbar-item">
          <Link to={`/users/${userId}/exercises`}>Exercises</Link>
        </li>
        <li className="navbar-item">
          <Link to={`/users/${userId}/routines`}>Routines</Link>
        </li>
        {currentWorkoutExercises.length > 0 && !isOnWorkoutPage &&
          <li className="navbar-item">
            <ResumeWorkoutButton url={`/users/${userId}/exercises/${currentWorkoutExercises[0].exerciseId}`} />
          </li>
        }
        {currentWorkoutExercises.length > 0 && (
          <li className="navbar-item">
            <EndWorkoutButton />
          </li>
        )}
        {!isAuthenticated && (
          <li className="navbar-item">
            <LoginButton />
          </li>
        )}
        {!isAuthenticated && (
          <li className="navbar-item">
            <SignupButton />
          </li>
        )}
        {isAuthenticated && (
          <li className="navbar-item">
            <LogoutButton />
          </li>
        )}
      </ul>
    </nav>
  );
}
