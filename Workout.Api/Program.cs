using Workout.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapExercisesEndpoints();

app.Run();
