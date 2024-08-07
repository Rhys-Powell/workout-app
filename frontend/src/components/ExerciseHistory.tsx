export default function ExerciseHistory({ isActive }: { isActive: boolean }) {
  return <div>{isActive && <h1>History</h1>}</div>;
}
