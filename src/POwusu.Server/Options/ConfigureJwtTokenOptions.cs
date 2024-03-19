using DeviceId;
using Microsoft.Extensions.Options;
using POwusu.Server.Extensions.Identity;
using POwusu.Server.Helpers;
using System.Reflection;

namespace POwusu.Server.Options
{
    public class ConfigureJwtTokenOptions : IConfigureOptions<JwtTokenOptions>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public ConfigureJwtTokenOptions(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        public void Configure(JwtTokenOptions options)
        {
            options.Secret = !string.IsNullOrEmpty(options.Secret) ? options.Secret : HashHelper.GenerateSHA256Hash(new DeviceIdBuilder()
                  .AddMachineName()
                  .AddOsVersion()
                  .AddUserName()
                  .AddFileToken(Path.ChangeExtension(Assembly.GetEntryAssembly()!.Location, nameof(options.Secret).ToLower())).ToString());

            var httpContext = _httpContextAccessor?.HttpContext;
            if (httpContext == null) throw new InvalidOperationException("Unable to determine the current HttpContext.");

            var allowedHosts = new string[] { string.Concat(httpContext.Request.Scheme, "://", httpContext.Request.Host.ToUriComponent()) }.ToList();
            allowedHosts.AddRange((options.Issuer ?? string.Empty).Split(JwtTokenOptions.Seperator).SkipWhile(string.IsNullOrEmpty).ToArray());
            allowedHosts = allowedHosts.Distinct().ToList();

            var allowedOrigins = _configuration.GetSection("AllowedOrigins")?.Get<string[]>()?.ToList() ?? new List<string>();
            allowedOrigins.AddRange(allowedHosts);
            allowedOrigins.AddRange((options.Audience ?? string.Empty).Split(JwtTokenOptions.Seperator).SkipWhile(string.IsNullOrEmpty).ToArray());
            allowedOrigins = allowedOrigins.Distinct().ToList();

            options.Issuer = string.Join(JwtTokenOptions.Seperator, allowedHosts);
            options.Audience = string.Join(JwtTokenOptions.Seperator, allowedOrigins);

            options.AccessTokenExpiresIn = options.AccessTokenExpiresIn != TimeSpan.Zero ? options.AccessTokenExpiresIn : TimeSpan.FromDays(1);
            options.RefreshTokenExpiresIn = options.RefreshTokenExpiresIn != TimeSpan.Zero ? options.RefreshTokenExpiresIn : TimeSpan.FromDays(90);
        }
    }
}
