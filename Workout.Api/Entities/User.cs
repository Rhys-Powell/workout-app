using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Workout.Api.Entities;
public class User
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    // public int auth0_user_id { get; set; }

    // Navigation properties
    public ICollection<Routine> Routines { get; set; } = new List<Routine>();
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}
