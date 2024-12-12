using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Data;

public static class SeedData
{
    public static async Task SeedDatabaseAsync(WorkoutAppDbContext context)
    {
        // Ensure the database is created
        await context.Database.EnsureCreatedAsync();

        // Seed data only if there are no users
        if (!context.Users.Any())
        {
            var testUserId1 = "auth0|60d7cfa5f41a3e001f4fcd1c";
            var testUserId2 = "auth0|61b2b1ef154bda001f3e7768";

            context.Users.AddRange(
                new User
                {
                    Id = 1,
                    Name = "Test User1",
                    Email = "testuser1@example.com",
                    Auth0Id = testUserId1
                },
                new User
                {
                    Id = 2,
                    Name = "Test User2",
                    Email = "testuser2@example.com",
                    Auth0Id = testUserId2
                }
            );

            await context.SaveChangesAsync();
        }
    }
}
