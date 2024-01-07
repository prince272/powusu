using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;

namespace POwusu.Server.Extensions.Authentication
{
    public static class JwtTokenExtensions
    {
        public static AuthenticationBuilder AddJwtTokenManager(this AuthenticationBuilder builder, Action<JwtTokenOptions>? options = null)
        {
            var services = builder.Services;
            if (options != null) services.Configure(options);
            else services.ConfigureOptions<ConfigureJwtTokenOptions>();
            services.AddScoped<IJwtTokenManager, JwtTokenManager>();
            return builder;
        }
    }
}
