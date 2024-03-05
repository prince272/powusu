using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using POwusu.Server.Data;
using POwusu.Server.Helpers;
using System.Reflection.Emit;
using System.Text.Json;
using WebPush;
using LibPushSubscription = WebPush.PushSubscription;

namespace POwusu.Server.Extensions.WebPusher
{
    public class WebPusher<TDbContext> : IWebPusher where TDbContext : DbContext
    {
        private readonly WebPushClient _client;
        private readonly VapidDetails _vapidDetails;
        private readonly TDbContext _dbContext;
        private static readonly SemaphoreSlim _lock = new SemaphoreSlim(1);

        public WebPusher(IOptions<WebPusherOptions> options, TDbContext dbContext)
        {
            _client = new WebPushClient();
            _vapidDetails = new VapidDetails(options.Value.VapidSubject, options.Value.VapidPublicKey, options.Value.VapidPrivateKey);
            _dbContext = dbContext;
        }

        public async Task<WebPushSubscription> SubscribeAsync(WebPushSubscription subscription)
        {
            var subscriptions = _dbContext.Set<WebPushSubscription>();

            if (await subscriptions.AnyAsync(_ => _.P256Dh == subscription.P256Dh))
                return subscription;

            await _lock.WaitAsync();

            try
            {
                await subscriptions.AddAsync(subscription);
                await _dbContext.SaveChangesAsync();

                return subscription;
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task UnsubscribeAsync(WebPushSubscription subscription)
        {
            var subscriptions = _dbContext.Set<WebPushSubscription>();

            var existingSubscription = await subscriptions.FirstOrDefaultAsync(_ => _.P256Dh == subscription.P256Dh);

            if (existingSubscription != null)
            {
                await _lock.WaitAsync();

                try
                {
                    subscriptions.Remove(existingSubscription);
                    await _dbContext.SaveChangesAsync();
                }
                finally
                {
                    _lock.Release();
                }
            }
        }

        public Task SendAsync(WebPushNotification notification, string subscriberId)
        {
            return SendAsync(notification, _dbContext.Set<WebPushSubscription>().Where(_ => _.SubscriberId == subscriberId));
        }

        public Task SendAsync(WebPushNotification notification, string[] subscriberIds)
        {
            return SendAsync(notification, _dbContext.Set<WebPushSubscription>().Where(_ => subscriberIds.Contains(_.SubscriberId)));
        }

        public Task SendAllExceptAsync(WebPushNotification notification, string[] subscriberIds)
        {
            return SendAsync(notification, _dbContext.Set<WebPushSubscription>().Where(_ => !subscriberIds.Contains(_.SubscriberId)));
        }   

        public Task SendAllAsync(WebPushNotification notification)
        {
            return SendAsync(notification, _dbContext.Set<WebPushSubscription>());
        }

        private async Task SendAsync(WebPushNotification notification, IQueryable<WebPushSubscription> query)
        {
            await _lock.WaitAsync();

            try
            {
                var totalSubscriptions = await query.CountAsync();

                foreach (var (skip, take) in new Chunks(totalSubscriptions, 1000))
                {
                    var subscriptions = await query.Skip(skip).Take(take).ToArrayAsync();

                    foreach (var subscription in subscriptions)
                    {
                        var payload = JsonSerializer.Serialize(notification, new JsonSerializerOptions(JsonSerializerDefaults.Web));
                        await _client.SendNotificationAsync(new LibPushSubscription(subscription.Endpoint, subscription.P256Dh, subscription.Auth), payload, _vapidDetails);
                    }
                }
            }
            finally
            {
                _lock.Release();
            }
        }
    }
}