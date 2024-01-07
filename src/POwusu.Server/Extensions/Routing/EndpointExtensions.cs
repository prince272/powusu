using POwusu.Server.Helpers;
using System.Reflection;

namespace POwusu.Server.Extensions.Routing
{
    public static class EndpointExtensions
    {
        public static IServiceCollection AddEndpoints(this IServiceCollection services, params Assembly[] assemblies)
        {
            var concreteTypes = assemblies.SelectMany(_ => _.DefinedTypes).Select(_ => _.AsType())
                .Where(type => type.IsClass && !type.IsAbstract && type.IsCompatibleWith(typeof(IEndpoint)));

            foreach (var concreteType in concreteTypes)
            {
                var interfaceType = concreteType.GetInterfaces().FirstOrDefault(_ => _ == typeof(IEndpoint));

                if (interfaceType is not null)
                {
                    services.AddScoped(interfaceType, concreteType);
                }
            }

            return services;
        }

        public static void MapEndpoints(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var endpoints = scope.ServiceProvider.GetServices<IEndpoint>();
            foreach (var endpoint in endpoints) endpoint.Configure(app);
        }
    }
}
