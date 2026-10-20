using CulinaryBlog.API.Endpoints;
using Xunit;

namespace CulinaryBlog.API.Tests;

internal static class ResponseAssert
{
    public static ApiResponseResult Status(int expected, ApiResponseResult response)
    {
        Assert.Equal(expected, response.StatusCode);
        return response;
    }
}
