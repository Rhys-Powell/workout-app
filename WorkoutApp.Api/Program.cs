using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Endpoints;
using WorkoutApp.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

var serverVersion = new MySqlServerVersion(new Version(8, 0, 39));

var server = builder.Configuration["DB_SERVER"];
var port = builder.Configuration["DB_PORT"];
var database = builder.Configuration["DB_DATABASE"];
var user = builder.Configuration["DB_USER"];
var password = builder.Configuration["MYSQL_ROOT_PASSWORD"];

var connectionString = $"Server={server};Port={port};Database={database};User={user};Password={password};";

builder.Services.AddDbContext<WorkoutAppDbContext>(
    dbContextOptions => dbContextOptions
        .UseMySql(connectionString, serverVersion)
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "https://workout-app-rwp.netlify.app")
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
      options.AddPolicy("RequireAdmin", policy =>
              policy.RequireClaim("permissions", "all"));
  });

var app = builder.Build();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ClientIdMiddleware>();
app.UseWhen(context =>
    !context.Request.Path.Value!.StartsWith("/api/users/auth", StringComparison.OrdinalIgnoreCase) &&
    !context.Request.Path.Equals("/api/health", StringComparison.OrdinalIgnoreCase), appBuilder =>
{
    appBuilder.UseMiddleware<OwnershipMiddleware>();
});

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
app.MapHealthEndpoints();
app.MapWorkoutEndpoints();
app.MapSetEndpoints();
await app.MigrateDbAsync();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WorkoutAppDbContext>();
    await SeedData.SeedDatabaseAsync(context);
}

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