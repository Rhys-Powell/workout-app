export default function ExerciseSets({ isActive }: { isActive: boolean }) {
  return <div>{isActive && <h2>Exercise Sets</h2>}</div>;
}
