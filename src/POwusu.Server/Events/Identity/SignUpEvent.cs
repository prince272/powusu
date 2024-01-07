using MediatR;

namespace POwusu.Server.Events.Identity
{
    public class SignUpEvent : INotification
    {
        public string UserId { get; set; } = null!;
    }
}
