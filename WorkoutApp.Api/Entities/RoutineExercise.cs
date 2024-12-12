using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutApp.Api.Entities;

public class RoutineExercise
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int RoutineId { get; set; }
    public int ExerciseId { get; set; }
    public int ExerciseOrder { get; set; }

    // Navigation properties
    public Routine? Routine { get; set; }
    public Exercise? Exercise { get; set; }
}