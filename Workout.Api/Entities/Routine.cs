using System.ComponentModel.DataAnnotations.Schema;

namespace Workout.Api.Entities;

public class Routine
{
    public int Id { get; set; }
    [Column(TypeName = "TEXT NOT NULL")]
    public required string Name { get; set; }
    public int UserId { get; set; }
    // Navigation properties
    public User? User { get; set; }
    public ICollection<RoutineExercise> RoutineExercises { get; set; } = new List<RoutineExercise>();
}
