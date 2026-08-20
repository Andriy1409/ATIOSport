using AtioSport.Application.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteProblemAsync(context, StatusCodes.Status404NotFound, "Not Found", ex.Message);
        }
        catch (ConflictException ex)
        {
            await WriteProblemAsync(context, StatusCodes.Status409Conflict, "Conflict", ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteProblemAsync(context, StatusCodes.Status500InternalServerError, "Server Error", "An unexpected error occurred.");
        }
    }

    private static async Task WriteProblemAsync(HttpContext context, int statusCode, string title, string detail)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail
        };

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}
