namespace Workout.Api.Dtos;

public class RoutineDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int UserId { get; set; }
}