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

        public ConfigureJwtTokenOptions(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
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

            var server = string.Concat(httpContext.Request.Scheme, "://", httpContext.Request.Host.ToUriComponent());

            options.Issuer = string.Join(JwtTokenOptions.Seperator, (options.Issuer ?? string.Empty).Split(JwtTokenOptions.Seperator).Append(server).Distinct().SkipWhile(string.IsNullOrEmpty).ToArray());
            options.Audience = string.Join(JwtTokenOptions.Seperator, (options.Audience ?? string.Empty).Split(JwtTokenOptions.Seperator).Append(server).Distinct().SkipWhile(string.IsNullOrEmpty).ToArray());

            options.AccessTokenExpiresIn = options.AccessTokenExpiresIn != TimeSpan.Zero ? options.AccessTokenExpiresIn : TimeSpan.FromDays(1);
            options.RefreshTokenExpiresIn = options.RefreshTokenExpiresIn != TimeSpan.Zero ? options.RefreshTokenExpiresIn : TimeSpan.FromDays(90);
        }
    }
}
