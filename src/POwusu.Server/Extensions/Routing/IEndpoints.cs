using Microsoft.AspNetCore.Builder;

namespace POwusu.Server.Extensions.Routing
{
    public interface IEndpoints
    {
        void Configure(IEndpointRouteBuilder builder);
    }
}
