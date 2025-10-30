namespace DatingApp.DTOs
{
    public class UserDTO
    {
        public required string sId { get; set; }
        public required string sDisplayName { get; set; }
        public required string sEmail { get; set; }
        public  string? sImageUrl { get; set; }
        public required string sToken { get; set; }

    }
}
