export default function ExerciseHistory({ isActive }: { isActive: boolean }) {
  return ( 
    <>
      {isActive && (
        <>
          <h2>History</h2>
          <p>Coming soon!</p>
        </>
      )}
    </>
  )
}
