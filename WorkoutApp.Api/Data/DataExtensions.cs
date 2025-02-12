using Microsoft.EntityFrameworkCore;

namespace WorkoutApp.Api.Data;

public static class DataExtensions
{
    public static async Task MigrateDbAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<WorkoutAppDbContext>();
        await dbContext.Database.MigrateAsync();
    }
}
