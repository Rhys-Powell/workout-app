using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutApp.Api.Entities;
public class User
{
    public virtual int Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string Auth0Id { get; set; }

    // Navigation properties
    public ICollection<Routine> Routines { get; set; } = new List<Routine>();
    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
}
