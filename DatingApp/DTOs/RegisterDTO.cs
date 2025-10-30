using System.ComponentModel.DataAnnotations;

namespace DatingApp.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string sDisplayname { get; set; } = "";
        [Required]
        [EmailAddress]
        public string sEmail { get; set; } = "";
        [Required]
        [MinLength(5)]
        public string sPassword { get; set; } = "";

    }
}
