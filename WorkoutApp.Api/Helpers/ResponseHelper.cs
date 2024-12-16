namespace WorkoutApp.Api.Helpers;

public static class ResponseHelper
{
    public static void SetUnauthorizedResponse(HttpContext context)
    {
        context.Response.StatusCode = 401;
        context.Response.WriteAsync("Unauthorized");
    }

    public static void SetForbiddenResponse(HttpContext context)
    {
        context.Response.StatusCode = 403;
        context.Response.WriteAsync("Forbidden");
    }
}