namespace WorkoutApp.Api.Middleware;

public class ClientIdMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _m2mClientId;

    public ClientIdMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;

        // Get the M2M client ID from appsettings or environment variables
        _m2mClientId = configuration["Auth0:M2MClientId"] ?? Environment.GetEnvironmentVariable("M2MClientId") ?? string.Empty;
        if (string.IsNullOrEmpty(_m2mClientId))
        {
            throw new InvalidOperationException("M2MClientId is not configured in appsettings or environment variables.");
        }
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var azpClaim = context.User.Claims.FirstOrDefault(x => x.Type == "azp");
        var clientId = azpClaim?.Value;
        try
        {
            // Check the 'azp' claim to determine if it's an M2M client
            if (clientId == _m2mClientId)
            {
                context.Items["IsM2M"] = true;
            }
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync($"Error parsing token: {ex.Message}");
            return;
        }

        await _next(context);
    }
}