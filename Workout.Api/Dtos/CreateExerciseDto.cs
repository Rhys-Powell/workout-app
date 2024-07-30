using System.ComponentModel.DataAnnotations;

namespace Workout.Api.Dtos;

public record class CreateExerciseDto(
    [Required][StringLength(50)] string Name
);
