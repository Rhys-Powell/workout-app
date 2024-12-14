using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace WorkoutApp.Api.Helpers;

public class TokenValidator
{
    private static JwtBearerOptions? _jwtOptions;

    public static void Initialize(IOptions<JwtBearerOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public async Task<SecurityToken> ValidateToken(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var tokenValidationParameters = _jwtOptions?.TokenValidationParameters;
        if (tokenValidationParameters != null)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out Microsoft.IdentityModel.Tokens.SecurityToken validatedToken);
                return validatedToken;
            }
            catch (SecurityTokenException ex)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized: " + ex.Message);
                throw;
            }
            catch (ArgumentException ex)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Bad Request: " + ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Internal Server Error: " + ex.Message);
                throw;
            }
        }
        else
        {
            throw new InvalidOperationException("TokenValidationParameters is null");
        }
    }
}
