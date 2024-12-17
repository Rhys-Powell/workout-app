using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Dtos;

public class WorkoutDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public ICollection<Set>? Sets { get; set; }
}