using Microsoft.EntityFrameworkCore.Migrations;

namespace WorkoutApp.Api.Migrations.WorkoutAppDb
{
    /// <inheritdoc />
    public partial class RenameSetTableToSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Set",
                newName: "Sets");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Sets",
                newName: "Set");
        }
    }
}
