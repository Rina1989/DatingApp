using System;
using API.Context;
using API.Extension;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter    //IAsyncActionFilter- middleware for controller actions. 
// ASP.NET Core interface that lets you run custom code before and after a controller action executes.
{
    //This class updates the user's LastActive time in the database whenever they make an authenticated request.
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var memberId = resultContext.HttpContext.User.GetMemberId();

        var dbContext = resultContext.HttpContext.RequestServices
        .GetRequiredService<AppDbContext>();

        await dbContext.Members.Where(x => x.Id == memberId)
        .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.LastActive, DateTime.UtcNow));
    }
}
