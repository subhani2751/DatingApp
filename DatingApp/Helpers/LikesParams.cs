namespace DatingApp.Helpers
{
    public class LikesParams: PagingParams
    {
        public string predicate { get; set; } = "liked";
        public string memberId { get; set; } = string.Empty;
    }
}
