using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace DatingApp.Controllers
{
    public class AccountController(UserManager<AppUser> userManager,ITokenService  tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            var user = new AppUser
            {
                sEmail = registerDTO.sEmail,
                Email = registerDTO.sEmail,
                sDisplayName = registerDTO.sDisplayname,
                UserName = registerDTO.sEmail,
                Member = new Member
                {
                    sDisplayName= registerDTO.sDisplayname,
                    sGender = registerDTO.sGender,
                    sCity = registerDTO.sCity,
                    sCountry = registerDTO.sCountry,
                    DateOfBirth = registerDTO.DateOfBirth
                }
            };
            var result = await userManager.CreateAsync(user, registerDTO.sPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("identity", error.Description);
                }
                return ValidationProblem();
            }

            var roleResult = await userManager.AddToRoleAsync(user, "Member");
            await SetRefreshTokenCookie(user);

            return await user.ToDto(tokenService);    
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await userManager.FindByEmailAsync(loginDTO.sEmail);
            if(user==null) return Unauthorized("Invalid Email Address");

            var result = await userManager.CheckPasswordAsync(user, loginDTO.sPassword);
            
            if (!result == true) return Unauthorized("Invalid Password");

            await SetRefreshTokenCookie(user);

            return await user.ToDto(tokenService);
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDTO>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if(refreshToken == null) return NoContent();
            var user = await userManager.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiry > DateTime.UtcNow);
            if(user == null) return Unauthorized();
            await SetRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }
        private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
