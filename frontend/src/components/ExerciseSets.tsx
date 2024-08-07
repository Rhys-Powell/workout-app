export default function ExerciseSets({ isActive }: { isActive: boolean }) {
  return <div>{isActive && <h1>Exercise Sets</h1>}</div>;
}
