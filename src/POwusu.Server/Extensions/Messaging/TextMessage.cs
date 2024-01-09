using POwusu.Server.Extensions.Mailing;

namespace POwusu.Server.Extensions.Messaging
{
    public class TextMessage
    {
        public string Body { get; set; } = default!;

        public IList<string> Recipients { get; set; } = new List<string>();
    }
}
