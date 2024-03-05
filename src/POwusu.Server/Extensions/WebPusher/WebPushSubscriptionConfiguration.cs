using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace POwusu.Server.Extensions.WebPusher
{
    public class WebPushSubscriptionConfiguration : IEntityTypeConfiguration<WebPushSubscription>
    {
        public void Configure(EntityTypeBuilder<WebPushSubscription> builder)
        {
            builder.ToTable(nameof(WebPushSubscription));
        }
    }
}
