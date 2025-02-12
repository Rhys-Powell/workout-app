using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Data;

public class WorkoutAppDbContext : DbContext
{
    public WorkoutAppDbContext() : base() { }

    public WorkoutAppDbContext(DbContextOptions<WorkoutAppDbContext> options)
    : base(options) { }

    public DbSet<Routine> Routines => Set<Routine>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<User> Users => Set<User>();

    public DbSet<RoutineExercise> RoutineExercise => Set<RoutineExercise>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<Set> Sets => Set<Set>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RoutineExercise>()
            .HasKey(we => we.Id);
    }
}