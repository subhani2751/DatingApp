namespace DatingApp.Errors
{
    public class ApiException(int Istatuscode,string sMessage,string? sDetails)
    {
        public int Istatuscode { get; set; } = Istatuscode;
        public string sMessage { get; set; } = sMessage;
        public string? sDetails { get; set; } = sDetails;
    }
}
