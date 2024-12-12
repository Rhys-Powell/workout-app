namespace WorkoutApp.Api.Dtos;

public class ExerciseDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int UserId { get; set; }
}