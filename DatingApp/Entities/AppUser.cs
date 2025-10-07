using System.ComponentModel.DataAnnotations;

namespace DatingApp.Entities
{
    public class AppUser
    {
        [Key]
        public string sID { get; set; } = Guid.NewGuid().ToString();
        public required string sDisplayName { get; set; }
        public required string sEmail { get; set; }
    }
}
