namespace WorkoutApp.Api.Entities;

public class Set
{
    public int Id { get; set; }
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public int UserId { get; set; }
    public int Reps { get; set; }
    public decimal WeightKg { get; set; }
    public DateTime? EndTime { get; set; }
    public TimeSpan? RestTime { get; set; }
}