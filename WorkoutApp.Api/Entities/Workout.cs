namespace WorkoutApp.Api.Entities;

public class Workout
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public ICollection<Set>? Sets { get; set; }

}