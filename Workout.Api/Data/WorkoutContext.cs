using Microsoft.EntityFrameworkCore;
using Workout.Api.Entities;

namespace Workout.Api.Data;

public class WorkoutContext(DbContextOptions<WorkoutContext> options)
    : DbContext(options)
{
    public DbSet<Exercise> Exercises => Set<Exercise>();
}
