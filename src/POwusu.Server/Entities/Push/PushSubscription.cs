using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Entities.Push
{
    public class PushSubscription
    {
        public string? UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public string? UserAgent { get; set; } = null!;

        public string Endpoint { get; set; } = null!;

        public double? ExpirationTime { get; set; }

        [Key]
        public string P256Dh { get; set; } = null!;

        public string Auth { get; set; } = null!;
    }
}
