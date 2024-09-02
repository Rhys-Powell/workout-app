// using Microsoft.EntityFrameworkCore.Migrations;

// #nullable disable

// namespace Workout.Api.Migrations
// {
//     /// <inheritdoc />
//     public partial class InitialCreate : Migration
//     {
//         /// <inheritdoc />
//         protected override void Up(MigrationBuilder migrationBuilder)
//         {
//             migrationBuilder.CreateTable(
//                 name: "Users",
//                 columns: table => new
//                 {
//                     Id = table.Column<int>(type: "INTEGER", nullable: false)
//                         .Annotation("Sqlite:Autoincrement", true),
//                     Name = table.Column<string>(type: "TEXT", nullable: false),
//                     Email = table.Column<string>(type: "TEXT", nullable: false)
//                 },
//                 constraints: table =>
//                 {
//                     table.PrimaryKey("PK_Users", x => x.Id);
//                 });

//             migrationBuilder.CreateTable(
//                 name: "Exercises",
//                 columns: table => new
//                 {
//                     Id = table.Column<int>(type: "INTEGER", nullable: false)
//                         .Annotation("Sqlite:Autoincrement", true),
//                     Name = table.Column<string>(type: "TEXT NOT NULL", nullable: false),
//                     UserId = table.Column<int>(type: "INTEGER", nullable: false)
//                 },
//                 constraints: table =>
//                 {
//                     table.PrimaryKey("PK_Exercises", x => x.Id);
//                     table.ForeignKey(
//                         name: "FK_Exercises_Users_UserId",
//                         column: x => x.UserId,
//                         principalTable: "Users",
//                         principalColumn: "Id",
//                         onDelete: ReferentialAction.Cascade);
//                 });

//             migrationBuilder.CreateTable(
//                 name: "Routines",
//                 columns: table => new
//                 {
//                     Id = table.Column<int>(type: "INTEGER", nullable: false)
//                         .Annotation("Sqlite:Autoincrement", true),
//                     Name = table.Column<string>(type: "TEXT NOT NULL", nullable: false),
//                     UserId = table.Column<int>(type: "INTEGER", nullable: false)
//                 },
//                 constraints: table =>
//                 {
//                     table.PrimaryKey("PK_Routines", x => x.Id);
//                     table.ForeignKey(
//                         name: "FK_Routines_Users_UserId",
//                         column: x => x.UserId,
//                         principalTable: "Users",
//                         principalColumn: "Id",
//                         onDelete: ReferentialAction.Cascade);
//                 });

//             migrationBuilder.CreateTable(
//                 name: "RoutineExercise",
//                 columns: table => new
//                 {
//                     RoutineId = table.Column<int>(type: "INTEGER", nullable: false),
//                     ExerciseId = table.Column<int>(type: "INTEGER", nullable: false),
//                     Id = table.Column<int>(type: "INTEGER", nullable: false),
//                     ExerciseOrder = table.Column<int>(type: "INTEGER", nullable: false)
//                 },
//                 constraints: table =>
//                 {
//                     table.PrimaryKey("PK_RoutineExercise", x => new { x.RoutineId, x.ExerciseId });
//                     table.ForeignKey(
//                         name: "FK_RoutineExercise_Exercises_ExerciseId",
//                         column: x => x.ExerciseId,
//                         principalTable: "Exercises",
//                         principalColumn: "Id",
//                         onDelete: ReferentialAction.Cascade);
//                     table.ForeignKey(
//                         name: "FK_RoutineExercise_Routines_RoutineId",
//                         column: x => x.RoutineId,
//                         principalTable: "Routines",
//                         principalColumn: "Id",
//                         onDelete: ReferentialAction.Cascade);
//                 });

//             migrationBuilder.CreateIndex(
//                 name: "IX_Exercises_UserId",
//                 table: "Exercises",
//                 column: "UserId");

//             migrationBuilder.CreateIndex(
//                 name: "IX_RoutineExercise_ExerciseId",
//                 table: "RoutineExercise",
//                 column: "ExerciseId");

//             migrationBuilder.CreateIndex(
//                 name: "IX_Routines_UserId",
//                 table: "Routines",
//                 column: "UserId");
//         }

//         /// <inheritdoc />
//         protected override void Down(MigrationBuilder migrationBuilder)
//         {
//             migrationBuilder.DropTable(
//                 name: "RoutineExercise");

//             migrationBuilder.DropTable(
//                 name: "Exercises");

//             migrationBuilder.DropTable(
//                 name: "Routines");

//             migrationBuilder.DropTable(
//                 name: "Users");
//         }
//     }
// }
