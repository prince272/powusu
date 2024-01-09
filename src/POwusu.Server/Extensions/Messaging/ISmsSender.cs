namespace POwusu.Server.Extensions.Messaging
{
    public interface ISmsSender
    {
        Task SendAsync(TextMessage message, CancellationToken cancellationToken = default);
    }
}
