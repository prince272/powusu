namespace POwusu.Server.Extensions.EmailSender
{
    public class EmailMessage
    {
        public string Subject { get; set; } = null!;

        public string Body { get; set; } = null!;

        public IList<EmailAttachment> Attachments { get; set; } = new List<EmailAttachment>();

        public IList<string> Recipients { get; set; } = new List<string>();
    }

}
