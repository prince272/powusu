namespace POwusu.Server.Extensions.MessageSender.Fake
{
    public class FakeMessageSender : IMessageSender
    {
        public Task SendAsync(Message message, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }
    }
}
