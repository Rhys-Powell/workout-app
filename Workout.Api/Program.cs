using Workout.Api.Dtos;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

const string GetExerciseEndpointName = "GetExercise";

List<ExerciseDto> exercises = [
    new (
        1,
        "Bench Press"
    ),
    new (
        2,
        "Squat"
    ),
    new (
        3,
        "Deadlift"
    )
];

// GET /exercises
app.MapGet("exercises", () => exercises);

// GET /exercises/{id}
app.MapGet("exercises/{id}", (int id) =>
{
    ExerciseDto? exercise = exercises.Find(exercise => exercise.Id == id);

    return exercise is null ? Results.NotFound() : Results.Ok(exercise);
})
    .WithName(GetExerciseEndpointName);

// POST /exercises
app.MapPost("exercises", (CreateExerciseDto newExercise) =>
{
    ExerciseDto exercise = new(
        exercises.Count + 1,
        newExercise.Name
    );
    exercises.Add(exercise);
    return Results.CreatedAtRoute(GetExerciseEndpointName, new { id = exercise.Id }, exercise);
});

//PUT /exercises/{id}
app.MapPut("exercises/{id}", (int id, UpdateExerciseDto updatedExercise) =>
{
    var index = exercises.FindIndex(exercise => exercise.Id == id);

    if (index == -1)
    {
        return Results.NotFound();
    }

    exercises[index] = new ExerciseDto(
        id,
        updatedExercise.Name
    );
    return Results.NoContent();
});

// DELETE /exercises/{id}
app.MapDelete("exercises/{id}", (int id) =>
{
    exercises.RemoveAll(exercise => exercise.Id == id);
    return Results.NoContent();
});

app.Run();
