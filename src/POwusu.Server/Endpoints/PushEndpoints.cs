using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using POwusu.Server.Extensions.Routing;
using POwusu.Server.Models.Identity;
using POwusu.Server.Models.Push;
using POwusu.Server.Services;
using System.Net.Mime;
using System.Text;

namespace POwusu.Server.Endpoints
{
    public class PushEndpoints : IEndpoints
    {
        public void Configure(IEndpointRouteBuilder builder)
        {
            builder = builder.MapGroup("/push");

            builder.MapPost("subscribe", ([FromServices] IPushService pushService, [FromBody] PushSubscriptionForm form)
                => pushService.SubscribeAsync(form));

            builder.MapPost("unsubscribe", ([FromServices] IPushService pushService, [FromBody] PushSubscriptionForm form)
                => pushService.UnsubscribeAsync(form));

            builder.MapGet("vapid-public-key", ([FromServices] IOptions<PushServiceOptions> PushServiceOptions)
                => TypedResults.Ok(PushServiceOptions.Value.VapidDetails.PublicKey)).Produces<string>(contentType: MediaTypeNames.Text.Plain);

            builder.MapPost("", ([FromServices] IPushService pushService, [FromBody] PushNotificationForm form)
                      => pushService.SendAllAsync(form));

        }
    }
}