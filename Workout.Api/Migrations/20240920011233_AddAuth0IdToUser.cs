using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Workout.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuth0IdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Auth0Id",
                table: "Users",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Auth0Id",
                table: "Users");
        }
    }
}
