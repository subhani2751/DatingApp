using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DatingApp.Entities
{
    public class Photo
    {
        [Key]
        public int sId { get; set; }
        public required string sUrl { get; set; }
        public string? sPublicId { get; set; }

        //Navigation property
        [JsonIgnore]
        public Member Member { get; set; } = null!;

        public string memberId { get; set; } = null!;
    }
}
