
using AngleSharp.Css.Values;
using Flurl;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using POwusu.Server.Extensions.Routing;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Blog;
using POwusu.Server.Models.Identity;
using POwusu.Server.Services;
using System.Net.Http;
using System.Net.Mime;
using System.Xml.Linq;

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

            builder.MapPost("register", ([FromServices] IIdentityService identityService, [FromBody] RegisterAccountForm form)
                => identityService.RegisterAccountAsync(form));

            builder.MapPost("confirm", ([FromServices] IIdentityService identityService, [FromBody] ConfirmAccountForm form)
                => identityService.ConfirmAccountAsync(form));

            builder.MapPost("email/change", ([FromServices] IIdentityService identityService, [FromBody] ChangeEmailForm form)
                => identityService.UpdateAccountAsync(form));

            builder.MapPost("phone-number/change", ([FromServices] IIdentityService identityService, [FromBody] ChangePhoneNumberForm form)
                => identityService.UpdateAccountAsync(form));

            builder.MapPost("password/create", ([FromServices] IIdentityService identityService, [FromBody] CreatePasswordForm form)
                => identityService.CreatePasswordAsync(form));

            builder.MapPost("password/change", ([FromServices] IIdentityService identityService, [FromBody] ChangePasswordForm form)
                => identityService.ChangePasswordAsync(form));

            builder.MapPost("password/reset", ([FromServices] IIdentityService identityService, [FromBody] ResetPasswordForm form)
                => identityService.ResetPasswordAsync(form));

            builder.MapPost("tokens/generate", ([FromServices] IIdentityService identityService, [FromBody] GenerateTokenForm form)
                => identityService.GenerateTokenAsync(form));

            builder.MapPost("tokens/{provider}/generate", ([FromServices] IIdentityService identityService, [FromRoute] string provider)
                => identityService.GenerateTokenFromExternalAuthenticationAsync(provider));

            builder.MapGet("tokens/{provider}/generate", ([FromServices] IIdentityService identityService, [FromRoute] string provider, [FromQuery] string origin, IConfiguration configuration)
                => identityService.ConfigureExternalAuthenticationAsync(provider?.Pascalize()!, origin, configuration.GetSection("AllowedOrigins")?.Get<string[]>() ?? Array.Empty<string>()));

            builder.MapPost("tokens/refresh", ([FromServices] IIdentityService identityService, [FromBody] RefreshTokenForm form)
                => identityService.RefreshTokenAsync(form));

            builder.MapPost("tokens/revoke", ([FromServices] IIdentityService identityService, [FromBody] RevokeTokenForm form)
                => identityService.RevokeTokenAsync(form));

            builder.MapPut("profile", ([FromServices] IIdentityService identityService, [FromBody] EditProfileForm form)
                => identityService.EditProfileAsync(form));

            builder.MapPost("profile/images", async ([FromServices] IIdentityService identityService, HttpContext httpContext,
                [FromHeader(Name = "Upload-Name")] string name,
                [FromHeader(Name = "Upload-Length")] long length) =>
            {
                var path = $"/profile/images/{Guid.NewGuid()}{Path.GetExtension(name)}".ToLower();
                var result = await identityService.UploadProfileImageAsync(new UploadProfileImageForm
                {
                    Name = name,
                    Path = path,
                    Length = length,
                    Offset = 0,
                    Chunk = await httpContext.Request.Body.ToMemoryStreamAsync()
                });

                return result;
            });

            builder.MapPatch("profile/images", async ([FromServices] IIdentityService identityService, HttpContext httpContext, [FromQuery] string path,
                [FromHeader(Name = "Upload-Name")] string name,
                [FromHeader(Name = "Upload-Length")] long length,
                [FromHeader(Name = "Upload-Offset")] long offset) =>
            {
                var result = await identityService.UploadProfileImageAsync(new UploadProfileImageForm
                {
                    Name = name,
                    Path = path,
                    Length = length,
                    Offset = offset,
                    Chunk = await httpContext.Request.Body.ToMemoryStreamAsync()
                });

                return result;
            });
        }
    }
}