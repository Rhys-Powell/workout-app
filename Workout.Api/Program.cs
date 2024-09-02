using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var serverVersion = new MySqlServerVersion(new Version(8, 0, 39));
var connectionString = builder.Configuration.GetSection("DB_CONNECTION_STRING").Value;

builder.Services.AddDbContext<WorkoutContext>(
            dbContextOptions => dbContextOptions
                .UseMySql(connectionString, serverVersion)
        );

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

if (app.Environment.IsProduction())
{
    app.UseStaticFiles();

    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var feature = context.Features.Get<IExceptionHandlerFeature>();
            var exception = feature?.Error;

            var result = JsonSerializer.Serialize(new { error = "An error occurred" });
            await context.Response.WriteAsync(result);
        });
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowReactApp");
app.MapExerciseEndpoints();
app.MapUserEndpoints();
app.MapRoutineEndpoints();
app.MapRoutineExercisesEndpoints();
app.MapAuthenticationEndpoints();

await app.MigrateDbAsync();

app.Run();
