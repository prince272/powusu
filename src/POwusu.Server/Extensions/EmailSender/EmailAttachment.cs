namespace POwusu.Server.Extensions.EmailSender
{
    public class EmailAttachment
    {
        public string FileName { get; set; } = null!;

        public Stream Content { get; set; } = null!;

        public string ContentType { get; set; } = null!;
    }
}
