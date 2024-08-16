using System.ComponentModel.DataAnnotations;

namespace Workout.Api.Dtos;

public class UserDto
{
    public int Id { get; set; }

    [StringLength(50)]
    public required string Name { get; set; }

    [EmailAddress]
    public required string Email { get; set; }
}

