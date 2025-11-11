using DatingApp.Entities;
using DatingApp.Interfaces;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace DatingApp.Services
{
    public class TokenService(IConfiguration config, UserManager<AppUser> userManager) : ITokenService
    {
        public async Task<string> CreateToken(AppUser user)
        {
            var tokenKey = config["TokenKey"] ?? throw new Exception("Token Key is missing");
            if (tokenKey.Length < 64) throw new Exception("Token Key must be at least 64 characters long");
            var key =new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            var claims = new List<Claim>
            {
               new(ClaimTypes.Email,user.sEmail),
               new(ClaimTypes.NameIdentifier,user.sDisplayName),
               new("sId",user.sID)
               //new(ClaimTypes.Email,user.sEmail),
               //new("customevalue","cutome also possible"),
            };
            var roles= await userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler= new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(TokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public string GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(randomBytes);
        }

    }
}
