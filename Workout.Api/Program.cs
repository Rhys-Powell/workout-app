using Workout.Api.Data;
using Workout.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("Workout");
builder.Services.AddSqlite<WorkoutContext>(connString);

var app = builder.Build();

app.MapExercisesEndpoints();

app.Run();
