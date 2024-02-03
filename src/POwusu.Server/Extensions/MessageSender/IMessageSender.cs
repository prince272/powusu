namespace POwusu.Server.Extensions.MessageSender
{
    public interface IMessageSender
    {
        Task SendAsync(TextMessage message, CancellationToken cancellationToken = default);
    }
}
