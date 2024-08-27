export default function ExerciseHistory({ isActive }: { isActive: boolean }) {
  return <div>{isActive && <h2>History</h2>}</div>;
}
