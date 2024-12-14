export default function Profile() {

  const currentUserName = JSON.parse(localStorage.getItem("currentUserName") ?? '');

  if (!currentUserName) {
    return <div>No user found</div>;
  }
 
  return (
    <div>
      <h2>Welcome {currentUserName}</h2>
    </div>
  );
}