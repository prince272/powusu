using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using POwusu.Server.Extensions.Routing;
using POwusu.Server.Models.Identity;
using POwusu.Server.Models.Push;
using POwusu.Server.Services;
using System.Text;

namespace POwusu.Server.Endpoints
{
    public class PushEndpoints : IEndpoints
    {
        public PushEndpoints()
        {
        }

        public void Configure(IEndpointRouteBuilder builder)
        {
            builder = builder.MapGroup("/push");

            builder.MapPost("subscribe", ([FromServices] IPushService pushService, [FromBody] PushSubscriptionForm form)
                => pushService.SubscribeAsync(form));

            builder.MapPost("unsubscribe", ([FromServices] IPushService pushService, [FromBody] PushSubscriptionForm form)
                => pushService.UnsubscribeAsync(form));
        }
    }
}