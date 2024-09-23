import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../context/UseCurrentUserHook";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { isLoading, user: auth0user } = useAuth0();
  const userContext = useCurrentUser();
  const auth0id = auth0user?.sub; 
  const { updateCurrentUser, currentUser } = useCurrentUser() ?? {};

  useEffect(() => {
    if (!currentUser) {
      fetch(`${API_BASE_URL}/api/users/auth/${auth0id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then((fetchedUser) => {
        if (updateCurrentUser) {
          updateCurrentUser(fetchedUser);
        }
      });
    }
  }, [isLoading, auth0id, updateCurrentUser, currentUser]);

  if (isLoading || !userContext) {
    if (!userContext) {
      return <div>Error: User context not available</div>;
    }
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome {userContext.currentUser?.name}</h2>
    </div>
  );
}