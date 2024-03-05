using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace POwusu.Server.Extensions.WebPusher
{
    public static class WebPusherExtensions
    {
        public static IServiceCollection AddWebPusher<TDbContext>(this IServiceCollection services, Action<WebPusherOptions> options) where TDbContext : DbContext
        {
            services.Configure(options);
            services.AddWebPusher<TDbContext>();
            return services;
        }

        public static IServiceCollection AddWebPusher<TDbContext>(this IServiceCollection services) where TDbContext : DbContext
        {
            services.AddTransient<IWebPusher, WebPusher.WebPusher<TDbContext>>();
            return services;
        }
    }
}
