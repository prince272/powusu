using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using POwusu.Server.Entities.Identity;

namespace POwusu.Server.Extensions.WebPusher
{
    /// <summary>
    /// Database representation of a push subscription
    /// </summary>
    public class WebPushSubscription
    {
        /// <summary>
        /// Subscriber id associated with the push subscription.
        /// </summary>
        public string SubscriberId { get; set; } = null!;

        /// <summary>
        /// The endpoint associated with the push subscription.
        /// </summary>
        public string Endpoint { get; set; } = null!;

        /// <summary>
        /// The subscription expiration time associated with the push subscription, if there is one, or null otherwise.
        /// </summary>
        public double? ExpirationTime { get; set; }

        /// <summary>
        /// An
        /// <see href="https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman">Elliptic curve Diffie–Hellman</see>
        /// public key on the P-256 curve (that is, the NIST secp256r1 elliptic curve).
        /// The resulting key is an uncompressed point in ANSI X9.62 format.
        /// </summary>
        [Key]
        public string P256Dh { get; set; } = null!;

        /// <summary>
        /// An authentication secret, as described in
        /// <see href="https://tools.ietf.org/html/draft-ietf-webpush-encryption-08">Message Encryption for Web Push</see>.
        /// </summary>
        public string Auth { get; set; } = null!;
    }
}
