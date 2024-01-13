using POwusu.Server.Extensions.EmailSender;

namespace POwusu.Server.Extensions.EmailSender.MailKit
{
    public static class MailKitEmailExtensions
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
