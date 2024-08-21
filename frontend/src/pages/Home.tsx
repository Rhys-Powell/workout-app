import { useAuth } from '../context/AuthHooks';

export default function Home() {
  const context = useAuth();

  return (
    <div>
      <h2>Welcome {context?.user?.name}</h2>
    </div>
  );
}
