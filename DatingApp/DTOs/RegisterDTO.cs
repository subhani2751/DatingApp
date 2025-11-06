using System.ComponentModel.DataAnnotations;

namespace DatingApp.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string sDisplayname { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string sEmail { get; set; } = string.Empty;
        [Required]
        [MinLength(5)]
        public string sPassword { get; set; } = string.Empty;
        [Required]
        public string sGender { get; set; } = string.Empty;
        [Required]
        public string sCity { get; set; }= string.Empty;
        [Required]  
        public string sCountry {  get; set; } = string.Empty;
        [Required]
        public DateOnly DateOfBirth { get; set; }


    }
}
