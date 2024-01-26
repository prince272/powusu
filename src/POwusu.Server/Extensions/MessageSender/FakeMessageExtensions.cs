namespace POwusu.Server.Extensions.MessageSender
{
    public static class FakeMessageExtensions
    {
        public static IServiceCollection AddFakeMessageSender(this IServiceCollection services, Action<FakeMessageOptions> options)
        {
            services.Configure(options);
            services.AddFakeMessageSender();
            return services;
        }

        public static IServiceCollection AddFakeMessageSender(this IServiceCollection services)
        {
            services.AddTransient<IMessageSender, FakeMessageSender>();
            return services;
        }
    }
}
