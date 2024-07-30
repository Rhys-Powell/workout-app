using System.ComponentModel.DataAnnotations;

namespace Workout.Api.Dtos;

public record class UpdateExerciseDto(
    int Id,
    [Required][StringLength(50)] string Name
);
