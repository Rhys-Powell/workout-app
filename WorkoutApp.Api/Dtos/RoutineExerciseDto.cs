using System.Text.Json.Serialization;

namespace WorkoutApp.Api.Dtos;

public class RoutineExerciseDto
{
    public int Id { get; set; }
    public int RoutineId { get; set; }
    public int ExerciseId { get; set; }
    public int ExerciseOrder { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ExerciseDto? Exercise { get; set; }
}
