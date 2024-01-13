using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using POwusu.Server.Extensions.EmailSender;

namespace POwusu.Server.Extensions.EmailSender.MailKit
{
    public class MailKitEmailSender : IEmailSender
    {
        private readonly IOptions<MailKitEmailOptions> _emailOptions;

        public MailKitEmailSender(IOptions<MailKitEmailOptions> emailOptions)
        {
            _emailOptions = emailOptions ?? throw new ArgumentNullException(nameof(emailOptions));
        }

        public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
        {
            if (message == null) throw new ArgumentNullException(nameof(message));

            var minme = new MimeMessage();
            minme.From.Add(new MailboxAddress(_emailOptions.Value.Account.DisplayName, _emailOptions.Value.Account.Email));

            foreach (var recipient in message.Recipients)
            {
                minme.To.Add(new MailboxAddress(string.Empty, recipient));
            }

            minme.Subject = message.Subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = message.Body;

            foreach (var attachmentInfo in message.Attachments)
            {
                builder.Attachments.Add(attachmentInfo.FileName, attachmentInfo.Content, ContentType.Parse(attachmentInfo.ContentType));
            }

            minme.Body = builder.ToMessageBody();

            using var client = new SmtpClient();

            if (_emailOptions.Value.UseSsl)
            {
                await client.ConnectAsync(_emailOptions.Value.Host, _emailOptions.Value.Port, SecureSocketOptions.SslOnConnect, cancellationToken);
            }
            else
            {
                await client.ConnectAsync(_emailOptions.Value.Host, _emailOptions.Value.Port, SecureSocketOptions.StartTls, cancellationToken);
            }

            await client.AuthenticateAsync(_emailOptions.Value.Account.Username, _emailOptions.Value.Account.Password, cancellationToken);

            await client.SendAsync(minme, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }
    }
}
