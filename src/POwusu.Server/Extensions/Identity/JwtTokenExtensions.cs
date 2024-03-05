using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace POwusu.Server.Extensions.Identity
{
    public static class JwtTokenExtensions
    {
        public static IServiceCollection AddJwtTokenManager<TDbContext>(this IServiceCollection services, Action<JwtTokenOptions>? options = null)
            where TDbContext : DbContext
        {
            if (options != null) services.Configure(options);
            services.AddScoped<IJwtTokenManager, JwtTokenManager<TDbContext>>();
            return services;
        }
    }
}
