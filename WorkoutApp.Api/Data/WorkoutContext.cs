using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Data;

public class WorkoutContext(DbContextOptions<WorkoutContext> options)
    : DbContext(options)
{
    public DbSet<Routine> Routines => Set<Routine>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<User> Users => Set<User>();

    public DbSet<RoutineExercise> RoutineExercise => Set<RoutineExercise>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoutineExercise>()
            .HasKey(we => we.Id);
    }
}
