using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutApp.Api.Migrations.WorkoutAppDb
{
    /// <inheritdoc />
    public partial class RemoveAndAddColsToWorkoutsAndSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Set_Workouts_WorkoutId",
                table: "Sets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Set",
                table: "Sets");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Sets");

            migrationBuilder.RenameIndex(
                name: "IX_Set_WorkoutId",
                table: "Sets",
                newName: "IX_Sets_WorkoutId");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Sets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sets",
                table: "Sets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sets_Workouts_WorkoutId",
                table: "Sets",
                column: "WorkoutId",
                principalTable: "Workouts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            //Drop RestTime column from Workouts    
            migrationBuilder.DropColumn(
                name: "RestTime",
                table: "Workouts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sets_Workouts_WorkoutId",
                table: "Sets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sets",
                table: "Sets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Sets");

            migrationBuilder.RenameIndex(
                name: "IX_Sets_WorkoutId",
                table: "Sets",
                newName: "IX_Set_WorkoutId");

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "Sets",
                type: "datetime",
                nullable: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Set",
                table: "Sets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Set_Workouts_WorkoutId",
                table: "Sets",
                column: "WorkoutId",
                principalTable: "Workouts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "RestTime",
                table: "Workouts",
                type: "timespan",
                nullable: true);
        }
    }
}
