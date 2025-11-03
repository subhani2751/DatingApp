using DatingApp.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.DTOs
{
    public class SeedUserDTO
    {
        [Key]
        public required string sID { get; set; }
        public required string sEmail { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? sImageUrl { get; set; }
        public required string sDisplayName { get; set; }
        public DateTime Created { get; set; } 
        public DateTime LastActive { get; set; } 

        public required string sGender { get; set; }
        public string? sDescription { get; set; }

        public required string sCity { get; set; }
        public required string sCountry { get; set; }
    }
}
