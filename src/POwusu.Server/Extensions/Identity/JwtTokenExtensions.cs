using Microsoft.AspNetCore.Authentication;

namespace POwusu.Server.Extensions.Identity
{
    public static class JwtTokenExtensions
    {
        public static IServiceCollection AddJwtTokenManager(this IServiceCollection services, Action<JwtTokenOptions>? options = null)
        {
            if (options != null) services.Configure(options);
            services.AddScoped<IJwtTokenManager, JwtTokenManager>();
            return services;
        }
    }
}
