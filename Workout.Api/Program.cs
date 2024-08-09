using Workout.Api.Data;
using Workout.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("Workout");
builder.Services.AddSqlite<WorkoutContext>(connString);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });

});

var app = builder.Build();

app.UseCors("AllowReactApp");
app.MapExercisesEndpoints();

await app.MigrateDbAsync();

app.Run();
