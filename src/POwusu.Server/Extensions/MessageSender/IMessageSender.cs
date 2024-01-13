namespace POwusu.Server.Extensions.MessageSender
{
    public interface IMessageSender
    {
        Task SendAsync(Message message, CancellationToken cancellationToken = default);
    }
}
