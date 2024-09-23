using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using Workout.Api.Data;
using Workout.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var serverVersion = new MySqlServerVersion(new Version(8, 0, 39));

var server = builder.Configuration["DB_SERVER"];
var port = builder.Configuration["DB_PORT"];
var database = builder.Configuration["DB_DATABASE"];
var user = builder.Configuration["DB_USER"];
var password = builder.Configuration["MYSQL_ROOT_PASSWORD"];

var connectionString = $"Server={server};Port={port};Database={database};User={user};Password={password};";

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
                .WithOrigins("http://localhost:5173", "https://rhys-powell.github.io", "https://main--workout-app-rwp.netlify.app", "https://workout-app-rwp.netlify.app")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

var domain = $"https://{builder.Configuration["Auth0:Domain"]}";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = domain;
    options.Audience = builder.Configuration["Auth0:Audience"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
    };
});

builder.Services
  .AddAuthorization(options =>
  {
      options.AddPolicy("RequireAuthenticatedUser", policy =>
            policy.RequireAuthenticatedUser());
  });

var app = builder.Build();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

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

app.MapExerciseEndpoints();
app.MapUserEndpoints();
app.MapRoutineEndpoints();
app.MapRoutineExercisesEndpoints();

await app.MigrateDbAsync();

// Test the database connection
using (var connection = new MySqlConnection(connectionString))
{
    try
    {
        connection.Open();
        Console.WriteLine("Connection to MySQL database was successful.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to connect to MySQL database: {ex.Message}");
    }
}

app.Run();
