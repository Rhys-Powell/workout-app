using System.IdentityModel.Tokens.Jwt;
using WorkoutApp.Api.Helpers;

namespace WorkoutApp.Api.Middleware;

public class ClientIdMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _m2mClientId;

    // Inject IConfiguration to read the client ID from appsettings or environment variables
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
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        // Validate the access token
        var tokenValidator = new TokenValidator();
        var validationResult = await tokenValidator.ValidateToken(context);
        if (validationResult != null)
        {
            var jwtToken = validationResult as JwtSecurityToken;
            if (jwtToken != null)
                try
                {
                    // Check the 'azp' claim to determine if it's an M2M client
                    var clientId = jwtToken.Claims.FirstOrDefault(c => c.Type == "azp")?.Value;

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
}
