using DatingApp.Data;
using DatingApp.Extentions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if (context.HttpContext.User.Identity?.IsAuthenticated != true)
            {
                return;
            }
            var memberId = context.HttpContext.User.GetMemberId();
            //var dncontext = resultContext.HttpContext.RequestServices.GetService<.AppDbContext>();
            var dbcontext = resultContext.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
            await dbcontext.Members
                .Where(x => x.sID == memberId)
                .ExecuteUpdateAsync(s => s.SetProperty(b => b.LastActive, b => DateTime.UtcNow));

        }
    }
}
