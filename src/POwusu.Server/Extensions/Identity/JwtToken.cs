using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Extensions.Identity
{
    public class JwtToken
    {
        public virtual User User { get; set; } = null!;

        public string UserId { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string AccessTokenHash { get; set; } = null!;

        public DateTimeOffset AccessTokenExpiresAt { get; set; }

        public string RefreshTokenHash { get; set; } = null!;

        public DateTimeOffset RefreshTokenExpiresAt { get; set; }
    }
}
