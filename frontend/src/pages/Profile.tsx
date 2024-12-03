import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../context/UseCurrentUserHook";
import { useEffect, useRef } from "react";
import { extractSubstring } from "../helpers/extractSubstring";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { isLoading, user: auth0user, getAccessTokenSilently } = useAuth0();
  const { updateCurrentUser, currentUser } = useCurrentUser();
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (!hasFetchedUser.current) {
      hasFetchedUser.current = true;
      getAccessTokenSilently()
        .then((token) => {
          if (auth0user) {
            const auth0id = extractSubstring(auth0user.sub!, '|');
            fetch(`${API_BASE_URL}/api/users/auth/${auth0id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              }
            })
            .then(response => response.json())
            .then((fetchedUser) => {
              if (fetchedUser && updateCurrentUser) {
                updateCurrentUser(fetchedUser);
              }
            })
            .catch((error) => {
              console.error('Error fetching user:', error);
              return <div>Error: User not available</div>;
            });
          }
        })
        .catch((error) => {
          console.error('Error getting access token:', error);
          return <div>Error: User not available</div>;
        });
      }
  }, [updateCurrentUser, getAccessTokenSilently, auth0user]);

  if (isLoading || !hasFetchedUser.current || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome {currentUser.name}</h2>
    </div>
  );
}