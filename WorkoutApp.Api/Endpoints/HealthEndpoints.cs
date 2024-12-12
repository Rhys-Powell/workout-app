namespace WorkoutApp.Api.Endpoints;

public static class HealthEndpoints
{
    public static RouteGroupBuilder MapHealthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/health");

        //GET api/health
        group.MapGet("/", () =>
        {
            return Results.Ok("API is healthy!");
        }).RequireAuthorization();

        return group;
    }
}