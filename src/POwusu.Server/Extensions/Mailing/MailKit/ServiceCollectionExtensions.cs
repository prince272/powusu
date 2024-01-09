using Microsoft.Extensions.DependencyInjection;
using POwusu.Server.Extensions.Mailing;

namespace POwusu.Server.Extensions.Mailing.MailKit
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMailKitEmailSender(this IServiceCollection services, Action<MailKitEmailOptions> options)
        {
            services.Configure(options);
            services.AddMailKitEmailSender();
            return services;
        }

        public static IServiceCollection AddMailKitEmailSender(this IServiceCollection services)
        {
            services.AddTransient<IEmailSender, MailKitEmailSender>();
            return services;
        }
    }
}
