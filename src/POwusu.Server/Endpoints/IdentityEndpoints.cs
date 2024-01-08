
using Microsoft.AspNetCore.Mvc;
using POwusu.Server.Extensions.Routing;
using POwusu.Server.Models.Identity;
using POwusu.Server.Services;

namespace POwusu.Server.Endpoints
{
    public class IdentityEndpoints : IEndpoints
    {
        public IdentityEndpoints()
        {
        }

        public void Configure(IEndpointRouteBuilder builder)
        {
            builder = builder.MapGroup("/identity");

            builder.MapPost("/register", ([FromServices] IIdentityService identityService, [FromBody] RegisterForm form) 
                => identityService.RegisterAsync(form));

            builder.MapPost("/tokens/generate", ([FromServices] IIdentityService identityService, [FromBody] GenerateTokenForm form)
                => identityService.GenerateTokenAsync(form));

            builder.MapPost("/tokens/refresh", ([FromServices] IIdentityService identityService, [FromBody] RefreshTokenForm form)
                => identityService.RefreshTokenAsync(form));

            builder.MapPost("/tokens/revoke", ([FromServices] IIdentityService identityService, [FromBody] RevokeTokenForm form)
                => identityService.RevokeTokenAsync(form));

        }
    }
}