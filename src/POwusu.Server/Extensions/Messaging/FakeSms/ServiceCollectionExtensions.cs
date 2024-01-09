using Microsoft.Extensions.DependencyInjection;

namespace POwusu.Server.Extensions.Messaging.FakeSms
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddFakeSmsSender(this IServiceCollection services, Action<FakeSmsOptions> options)
        {
            services.Configure(options);
            services.AddFakeSmsSender();
            return services;
        }

        public static IServiceCollection AddFakeSmsSender(this IServiceCollection services)
        {
            services.AddTransient<ISmsSender, FakeSmsSender>();
            return services;
        }
    }
}
