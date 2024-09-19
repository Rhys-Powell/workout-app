import { useNavigate } from "react-router-dom";

export default function SignupButton() {
  
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/signup")}>
      Sign Up
    </button>
  );
};
