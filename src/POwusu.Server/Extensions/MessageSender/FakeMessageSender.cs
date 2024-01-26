namespace POwusu.Server.Extensions.MessageSender
{
    public class FakeMessageSender : IMessageSender
    {
        public Task SendAsync(Message message, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }
    }
}
