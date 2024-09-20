using Workout.Api.Dtos;
using Workout.Api.Entities;

namespace Workout.Api.Mapping;

public static class UserMapping
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Auth0Id = user.Auth0Id
        };
    }

    public static User ToEntity(this UserDto user)
    {
        return new User
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Auth0Id = user.Auth0Id
        };
    }
}

