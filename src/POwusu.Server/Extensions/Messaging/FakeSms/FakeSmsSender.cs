namespace POwusu.Server.Extensions.Messaging.FakeSms
{
    public class FakeSmsSender : ISmsSender
    {
        public Task SendAsync(TextMessage message, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }
    }
}
