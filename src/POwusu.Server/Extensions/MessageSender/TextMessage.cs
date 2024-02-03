namespace POwusu.Server.Extensions.MessageSender
{
    public class TextMessage
    {
        public string Body { get; set; } = null!;

        public IList<string> Recipients { get; set; } = new List<string>();
    }
}
