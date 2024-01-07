using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Extensions.Authentication
{
    public class JwtToken
    {
        public virtual User User { get; set; } = null!;

        public string UserId { get; set; } = null!;

        public string Id { get; set; } = null!;

        public string AccessTokenHash { get; set; } = default!;

        public DateTimeOffset AccessTokenExpiresAt { get; set; }

        public string RefreshTokenHash { get; set; } = default!;

        public DateTimeOffset RefreshTokenExpiresAt { get; set; }
    }
}
