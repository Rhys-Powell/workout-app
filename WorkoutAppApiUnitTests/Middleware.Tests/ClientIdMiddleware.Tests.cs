using Moq;
using WorkoutApp.Api.Middleware;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace WorkoutAppApiUnitTests.Middleware.Tests;

public class TestBase
{
    protected Mock<IConfiguration> ConfigurationMock { get; }
    protected Mock<RequestDelegate> NextMock { get; }
    protected Mock<HttpContext> HttpContextMock { get; }

    public TestBase()
    {
        ConfigurationMock = new Mock<IConfiguration>();
        NextMock = new Mock<RequestDelegate>();
        HttpContextMock = new Mock<HttpContext>();
    }
}

public class ClientIdMiddlewareTests : TestBase
{
    [Fact]
    public async Task Constructor_ThrowsInvalidOperationException_WhenM2MClientIdIsNotConfigured()
    {
        // Arrange
        ConfigurationMock.Setup(c => c["Auth0:M2MClientId"]).Returns(string.Empty);

        // Act 
        try
        {
            var middleware = new ClientIdMiddleware(NextMock.Object, ConfigurationMock.Object);
            await middleware.InvokeAsync(new DefaultHttpContext());

            //Assert
            Assert.Fail("Expected InvalidOperationException to be thrown");
        }
        catch (InvalidOperationException) { }
    }

    [Fact]
    public async Task InvokeAsync_DoesNotSetIsM2MtoTrue_WhenRequestClientIdDoesNotMatchM2MClientId()
    {
        // Arrange
        ConfigurationMock.Setup(c => c["Auth0:M2MClientId"]).Returns("ValidId");
        HttpContextMock.Setup(c => c.Request.Headers).Returns(new HeaderDictionary());
        HttpContextMock.Setup(c => c.Items).Returns(new Dictionary<object, object?>());
        HttpContextMock.Setup(c => c.User.Claims).Returns([new Claim("azp", "InvalidId")]);
        var middleware = new ClientIdMiddleware(NextMock.Object, ConfigurationMock.Object);

        // Act
        await middleware.InvokeAsync(HttpContextMock.Object);

        // Assert
        Assert.False(HttpContextMock.Object.Items.ContainsKey("IsM2M"));
    }

    [Fact]
    public async Task InvokeAsync_DoesSetIsM2MtoTrue_WhenRequestClientIdDoesMatchM2MClientId()
    {
        // Arrange
        ConfigurationMock.Setup(c => c["Auth0:M2MClientId"]).Returns("ValidId");
        HttpContextMock.Setup(c => c.Request.Headers).Returns(new HeaderDictionary());
        HttpContextMock.Setup(c => c.Items).Returns(new Dictionary<object, object?>());
        HttpContextMock.Setup(c => c.User.Claims).Returns([new Claim("azp", "ValidId")]);
        var middleware = new ClientIdMiddleware(NextMock.Object, ConfigurationMock.Object);

        // Act
        await middleware.InvokeAsync(HttpContextMock.Object);

        // Assert
        Assert.True(HttpContextMock.Object.Items["IsM2M"] as bool? == true);
    }
}