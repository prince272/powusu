using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Extensions.Identity
{
    public interface IUserContext
    {
        string? AnonymousId { get; }

        string? UserId { get; }

        string? UserAgent { get; }

        Task<User?> GetUserAsync();
    }
}
