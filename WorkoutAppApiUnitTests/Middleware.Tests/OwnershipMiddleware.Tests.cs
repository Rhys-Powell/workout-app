using Moq;
using Microsoft.AspNetCore.Http;
using WorkoutApp.Api.Data;
using System.Net;
using System.IdentityModel.Tokens.Jwt;
using WorkoutApp.Api.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Middleware;
using Moq.Protected;
using Microsoft.AspNetCore.Authentication;

namespace WorkoutAppApiUnitTests.Middleware.Tests;

public class TestUser : User
{
    public override int Id { get; set; }
}

public class OwnershipMiddlewareTests
{
    private readonly Mock<RequestDelegate> _nextMock;
    private readonly Mock<WorkoutAppDbContext> _dbContextMock;
    private readonly Mock<HttpContext> _contextMock;
    private readonly DefaultHttpContext _defaultHttpContext;
    private readonly Mock<TestUser> _userMock;

    private readonly Mock<OwnershipMiddleware> _middlewarePartialMock;

    public OwnershipMiddlewareTests()
    {
        _nextMock = new Mock<RequestDelegate>();
        _dbContextMock = new Mock<WorkoutAppDbContext>();
        _contextMock = new Mock<HttpContext>();
        _defaultHttpContext = new DefaultHttpContext();
        _contextMock.Setup(c => c.Request).Returns(_defaultHttpContext.Request);
        _contextMock.Setup(c => c.Response).Returns(_defaultHttpContext.Response);
        _contextMock.Setup(c => c.Connection).Returns(_defaultHttpContext.Connection);

        _userMock = new Mock<TestUser>();

        _middlewarePartialMock = new Mock<OwnershipMiddleware>(_nextMock.Object) { CallBase = true };
    }

    [Fact]
    public async Task InvokeAsync_AllowsRequest_IfIsAdminOrM2MUser()
    {
        // Arrange
        _contextMock.Setup(c => c.Items).Returns(new Dictionary<object, object?> { { "IsM2M", true } });

        // Act
        await _middlewarePartialMock.Object.InvokeAsync(_contextMock.Object, _dbContextMock.Object);

        // Assert
        _nextMock.Verify(n => n(It.IsAny<HttpContext>()), Times.Once);
    }

    [Fact]
    public async Task InvokeAsync_ReturnsUnauthorized_IfNoAccessToken()
    {
        // Arrange
        string? getTokenResult = null;
        _middlewarePartialMock.Protected().Setup<Task<string?>>("GetTokenAsyncWrapper", ItExpr.IsAny<HttpContext>()).Returns(Task.FromResult(getTokenResult));

        // Act
        await _middlewarePartialMock.Object.InvokeAsync(_contextMock.Object, _dbContextMock.Object);

        // Assert
        _nextMock.Verify(n => n(It.IsAny<HttpContext>()), Times.Never);
        Assert.Equal((int)HttpStatusCode.Unauthorized, _contextMock.Object.Response.StatusCode);
    }

    [Fact]
    public async Task InvokeAsync_ReturnsUnauthorized_IfInvalidAccessToken()
    {
        // Arrange
        string? getTokenResult = "invalid_token";

        var authenticationServiceMock = new Mock<IAuthenticationService>();
        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(p => p.GetService(typeof(IAuthenticationService))).Returns(authenticationServiceMock.Object);
        _contextMock.Setup(c => c.RequestServices).Returns(serviceProviderMock.Object);

        _middlewarePartialMock.Protected().Setup<Task<string?>>("GetTokenAsyncWrapper", _contextMock.Object).Returns(Task.FromResult<string?>(getTokenResult));

        _middlewarePartialMock.Protected().Setup<JwtSecurityToken>("ReadJWTTokenWrapper", ItExpr.IsAny<string>()).Throws(new Exception());

        // Act
        try
        {
            await _middlewarePartialMock.Object.InvokeAsync(_contextMock.Object, _dbContextMock.Object);
            // Assert
            Assert.Fail("Expected an exception to be thrown");
        }
        catch (Exception)
        {
            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, _contextMock.Object.Response.StatusCode);
        }
        _nextMock.Verify(n => n(It.IsAny<HttpContext>()), Times.Never); // Next middleware should not be called
    }

    [Fact]
    public async Task InvokeAsync_ReturnsForbidden_IfNotRequestingOwnData()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<WorkoutAppDbContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Unique DB for isolation
        .Options;

        var dbContext = new WorkoutAppDbContext(options);

        string validToken = "valid_token";
        string user1Auth0Id = "user1_auth0_id"; // Logged-in user
        string user2Auth0Id = "user2_auth0_id"; // Other user
        int currentUserId = 1;
        var requestMock = new Mock<HttpRequest>();
        var routeData = new RouteData();
        routeData.Values.Add("userId", "2"); // User's data that current user is trying to access

        // Mock user ID from the authentication service
        _userMock.SetupGet(u => u.Id).Returns(currentUserId);

        var authenticationServiceMock = new Mock<IAuthenticationService>();
        var serviceProviderMock = new Mock<IServiceProvider>();

        serviceProviderMock.Setup(p => p.GetService(typeof(IAuthenticationService))).Returns(authenticationServiceMock.Object);
        _contextMock.Setup(c => c.RequestServices).Returns(serviceProviderMock.Object);

        // Mock token retrieval
        _middlewarePartialMock
            .Protected()
            .Setup<Task<string?>>("GetTokenAsyncWrapper", _contextMock.Object)
            .Returns(Task.FromResult<string?>(validToken));

        // Mock JWT token with the "sub" claim
        var jwtToken = new JwtSecurityToken(new JwtHeader(), new JwtPayload { { "sub", user1Auth0Id } });
        _middlewarePartialMock
            .Protected()
            .Setup<JwtSecurityToken>("ReadJWTTokenWrapper", ItExpr.IsAny<string>())
            .Returns(jwtToken);

        // Set route values directly
        _middlewarePartialMock.Protected().Setup<RouteData>("GetRouteDataWrapper", ItExpr.IsAny<HttpContext>()).Returns(routeData);

        await using (dbContext)
        {
            var currentUser = new User
            {
                Id = 1,
                Name = "Current User",
                Email = "jFJfF@example.com",
                Auth0Id = user1Auth0Id
            };

            var otherUser = new User
            {
                Id = 2,
                Name = "Other User",
                Email = "jFJfF@example.com",
                Auth0Id = user2Auth0Id
            };

            dbContext.Users.Add(currentUser);
            dbContext.Users.Add(otherUser);

            dbContext.SaveChanges();

            await _middlewarePartialMock.Object.InvokeAsync(_contextMock.Object, dbContext);
        }

        // Assert
        Assert.Equal((int)HttpStatusCode.Forbidden, _contextMock.Object.Response.StatusCode);
        _nextMock.Verify(n => n(It.IsAny<HttpContext>()), Times.Never); // Next middleware should not be called
    }

    [Fact]
    public async Task InvokeAsync_AllowsRequest_IfRequestingOwnData()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<WorkoutAppDbContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Unique DB for isolation
        .Options;

        var dbContext = new WorkoutAppDbContext(options);

        string validToken = "valid_token";
        string user1Auth0Id = "user1_auth0_id"; // Logged-in user
        int currentUserId = 1;   // ID from the route
        var requestMock = new Mock<HttpRequest>();
        var routeData = new RouteData();
        routeData.Values.Add("userId", "1"); // User's data that current user is trying to access

        // Mock user ID from the authentication service
        _userMock.SetupGet(u => u.Id).Returns(currentUserId);

        var authenticationServiceMock = new Mock<IAuthenticationService>();
        var serviceProviderMock = new Mock<IServiceProvider>();

        serviceProviderMock.Setup(p => p.GetService(typeof(IAuthenticationService))).Returns(authenticationServiceMock.Object);
        _contextMock.Setup(c => c.RequestServices).Returns(serviceProviderMock.Object);

        // Mock token retrieval
        _middlewarePartialMock
            .Protected()
            .Setup<Task<string?>>("GetTokenAsyncWrapper", _contextMock.Object)
            .Returns(Task.FromResult<string?>(validToken));

        // Mock JWT token with the "sub" claim
        var jwtToken = new JwtSecurityToken(new JwtHeader(), new JwtPayload { { "sub", user1Auth0Id } });
        _middlewarePartialMock
            .Protected()
            .Setup<JwtSecurityToken>("ReadJWTTokenWrapper", ItExpr.IsAny<string>())
            .Returns(jwtToken);

        // Set route values directly
        _middlewarePartialMock.Protected().Setup<RouteData>("GetRouteDataWrapper", ItExpr.IsAny<HttpContext>()).Returns(routeData);

        // Act
        await using (dbContext)
        {
            var currentUser = new User
            {
                Id = 1,
                Name = "Current User",
                Email = "jFJfF@example.com",
                Auth0Id = user1Auth0Id
            };

            dbContext.Users.Add(currentUser);

            dbContext.SaveChanges();

            await _middlewarePartialMock.Object.InvokeAsync(_contextMock.Object, dbContext);
        }

        // Assert
        Assert.Equal((int)HttpStatusCode.OK, _contextMock.Object.Response.StatusCode);
        _nextMock.Verify(n => n(It.IsAny<HttpContext>()), Times.Once);
    }
}
