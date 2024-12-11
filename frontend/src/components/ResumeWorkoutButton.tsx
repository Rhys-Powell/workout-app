import { useNavigate } from "react-router-dom";

export default function ResumeWorkoutButton({ url }:{ url: string }) {
  
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(url)}>
      Resume workout
    </button>
  );
};