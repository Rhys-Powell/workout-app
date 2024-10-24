import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../context/UseCurrentUserHook";

const LogoutButton = () => {
  const { logout } = useAuth0();
  const { updateCurrentUser } = useCurrentUser() ?? {};

  const handleLogout = () => {
    logout({
      logoutParams: { returnTo: window.location.origin },
    }).then(() => {
      updateCurrentUser(null);
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