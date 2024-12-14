import { useAuth0 } from "@auth0/auth0-react";
import { useWorkoutContext } from "../context/UseWorkoutContextHook";

const LogoutButton = () => {
  const { logout } = useAuth0();
  const { removeCurrentWorkout } = useWorkoutContext() ?? {};

  const handleLogout = () => {
    logout({
      logoutParams: { returnTo: window.location.origin },
    }).then(() => {
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentUserName');
      removeCurrentWorkout();
    }).catch(err => {
      console.error('Logout failed', err);
    });
  };

  return (
    <button onClick={handleLogout}>
      Log out
    </button>
  );
};

export default LogoutButton;