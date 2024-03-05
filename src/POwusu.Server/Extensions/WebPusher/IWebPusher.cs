namespace POwusu.Server.Extensions.WebPusher
{
    public interface IWebPusher
    {
        Task<WebPushSubscription> SubscribeAsync(WebPushSubscription subscription);

        Task UnsubscribeAsync(WebPushSubscription subscription);

        Task SendAsync(WebPushNotification notification, string subscriberId);

        Task SendAsync(WebPushNotification notification, string[] subscriberIds);

        Task SendAllExceptAsync(WebPushNotification notification, string[] subscriberIds);

        Task SendAllAsync(WebPushNotification notification);
    }
}
