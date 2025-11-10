using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.Entities
{
    public class AppUser : IdentityUser
    {
        //[Key]
        public string sID { get; set; } = Guid.NewGuid().ToString();
        public required string sDisplayName { get; set; }
        public required string sEmail { get; set; }
        public string? sImageUrl { get; set; }
        //public required byte[]  PasswordHash { get; set; }
        //public required byte[] Passwordsalt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        //Navigation property
        public Member Member { get; set; } = null!;
    }
}
