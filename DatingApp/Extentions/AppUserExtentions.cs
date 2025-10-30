using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Interfaces;

namespace DatingApp.Extentions
{
    public static class AppUserExtentions
    {
        public static UserDTO ToDto(this AppUser user,ITokenService tokenService)
        {
            return new UserDTO
            {
                sId = user.sID,
                sDisplayName = user.sDisplayName,
                sEmail = user.sEmail,
                sToken = tokenService.CreateToken(user)
            };
        }
    }
}
