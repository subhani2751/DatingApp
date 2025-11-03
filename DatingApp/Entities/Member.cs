using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DatingApp.Entities
{
    public class Member
    {
        [Key]
        public string sID { get; set; } = null!;
        public DateOnly DateofBirth { get; set; }
        public string? sImageUrl { get; set; }
        public required string sDisplayName { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;

        public required string sGender { get; set; }
        public string? sDescription { get; set; }

        public required string sCity { get; set; }
        public required string sCountry { get; set; }
        [JsonIgnore]
        public List<Photo> Photos { get; set; } = [];
        [JsonIgnore]
        [ForeignKey(nameof(sID))]
        //Navigation property
        public AppUser user { get; set; } = null!;
    }
}
