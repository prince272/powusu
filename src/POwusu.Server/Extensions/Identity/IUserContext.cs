using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Extensions.Identity
{
    public interface IUserContext
    {
        string? AnonymousId { get; }

        string? UserId { get; }

        Task<User?> GetUserAsync();
    }
}
