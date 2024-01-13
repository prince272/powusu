namespace POwusu.Server.Extensions.MessageSender
{
    public class Message
    {
        public string Body { get; set; } = null!;

        public IList<string> Recipients { get; set; } = new List<string>();
    }
}
