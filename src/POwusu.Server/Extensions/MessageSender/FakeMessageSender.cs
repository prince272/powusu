namespace POwusu.Server.Extensions.MessageSender
{
    public class FakeMessageSender : IMessageSender
    {
        public Task SendAsync(TextMessage message, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }
    }
}
