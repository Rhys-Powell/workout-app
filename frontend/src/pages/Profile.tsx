import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "../context/UseCurrentUserHook";

export default function Profile() {
  const { isLoading } = useAuth0();
  const { currentUser, isUserFetched} = useCurrentUser();

  if (isLoading || !isUserFetched) {
    return <div>Loading...</div>;
  }
  else if (!currentUser) {
    return <div>No user found</div>;
  }
 
  return (
    <div>
      <h2>Welcome {currentUser.name}</h2>
    </div>
  );
}