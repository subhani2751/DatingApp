using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extentions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace DatingApp.Controllers
{
    public class AccountController(AppDbContext context,ITokenService  tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await EmailExist(registerDTO.sEmail)) return BadRequest("Email Taken");

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                sEmail = registerDTO.sEmail,
                sDisplayName = registerDTO.sDisplayname,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDTO.sPassword)),
                Passwordsalt = hmac.Key
            };
            context.users.Add(user);
            await context.SaveChangesAsync();
            return user.ToDto(tokenService);    
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await context.users.SingleOrDefaultAsync(x => x.sEmail.ToLower() == loginDTO.sEmail.ToLower());
            if(user==null) return Unauthorized("Invalid Email Address");
            using var hmac = new HMACSHA512(user.Passwordsalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDTO.sPassword));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }
            return user.ToDto(tokenService);
        }
        private async Task<bool> EmailExist(string sEmail)
        {
            return await context.users.AnyAsync(x => x.sEmail.ToLower() == sEmail.ToLower());
        }
    }
}
