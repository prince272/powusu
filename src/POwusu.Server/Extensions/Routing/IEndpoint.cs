using Microsoft.AspNetCore.Builder;

namespace POwusu.Server.Extensions.Routing
{
    public interface IEndpoint
    {
        void Configure(IEndpointRouteBuilder builder);
    }
}
