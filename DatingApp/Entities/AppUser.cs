using System.ComponentModel.DataAnnotations;

namespace DatingApp.Entities
{
    public class AppUser
    {
        [Key]
        public string sID { get; set; } = Guid.NewGuid().ToString();
        public required string sDisplayName { get; set; }
        public required string sEmail { get; set; }
        public string? sImageUrl { get; set; }
        public required byte[]  PasswordHash { get; set; }
        public required byte[] Passwordsalt { get; set; }

        //Navigation property
        public Member Member { get; set; } = null!;
    }
}
