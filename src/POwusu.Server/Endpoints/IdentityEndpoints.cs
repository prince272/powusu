
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

            builder.MapPost("/register", ([FromServices] IIdentityService identityService, [FromBody] RegisterAccountForm form) 
                => identityService.RegisterAccountAsync(form));

            builder.MapPost("/confirm", ([FromServices] IIdentityService identityService, [FromBody] ConfirmAccountForm form)
                => identityService.ConfirmAccountAsync(form));

            builder.MapPost("/password/reset", ([FromServices] IIdentityService identityService, [FromBody] ResetPasswordForm form)
                => identityService.ResetPasswordAsync(form));

            builder.MapPost("/tokens/generate", ([FromServices] IIdentityService identityService, [FromBody] GenerateTokenForm form)
                => identityService.GenerateTokenAsync(form));

            builder.MapPost("/tokens/{provider}/generate", ([FromServices] IIdentityService identityService, [FromRoute] string provider)
                => identityService.GenerateTokenFromExternalAuthenticationAsync(provider));

            builder.MapGet("/tokens/{provider}/generate", ([FromServices] IIdentityService identityService, [FromRoute] string provider, [FromQuery] string returnUrl, IConfiguration configuration)
                => identityService.ConfigureExternalAuthenticationAsync(provider, returnUrl, configuration.GetSection("AllowedOrigins")?.Get<string[]>() ?? Array.Empty<string>()));

            builder.MapPost("/tokens/refresh", ([FromServices] IIdentityService identityService, [FromBody] RefreshTokenForm form)
                => identityService.RefreshTokenAsync(form));

            builder.MapPost("/tokens/revoke", ([FromServices] IIdentityService identityService, [FromBody] RevokeTokenForm form)
                => identityService.RevokeTokenAsync(form));
        }
    }
}