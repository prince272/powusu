using DeviceId;
using Microsoft.Extensions.Options;
using POwusu.Server.Helpers;
using System.Reflection;

namespace POwusu.Server.Extensions.Identity
{
    public class JwtTokenOptions
    {
        public string Secret { set; get; } = null!;

        public string Issuer { set; get; } = null!;

        public string Audience { set; get; } = null!;

        public TimeSpan AccessTokenExpiresIn { set; get; }

        public TimeSpan RefreshTokenExpiresIn { set; get; }

        public bool AllowMultipleTokens { set; get; }


        public const string Seperator = ";";
    }
}
