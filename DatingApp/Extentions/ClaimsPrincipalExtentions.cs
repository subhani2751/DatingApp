using System;
using System.Security.Claims;

namespace DatingApp.Extentions
{
    public static class ClaimsPrincipalExtentions
    {
        public static string GetMemberId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue("sId") ?? throw new Exception("Cannot get memberId from token");
        } 
    }
}
