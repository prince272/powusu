using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using POwusu.Server.Data;
using POwusu.Server.Entities.Push;
using POwusu.Server.Extensions.Identity;
using POwusu.Server.Extensions.Validation;
using POwusu.Server.Helpers;
using POwusu.Server.Models.Push;
using System.Text.Json;
using System.Threading.Tasks;

namespace POwusu.Server.Services
{
    public class PushService : IPushService, IDisposable
    {
        private readonly IOptions<PushServiceOptions> _pushServiceOptions;
        private readonly WebPush.WebPushClient _client;
        private readonly AppDbContext _dbContext;
        private readonly IValidator _validator;
        private readonly IUserContext _userContext;
        private readonly SemaphoreSlim _lock = new SemaphoreSlim(1);

        public PushService(IOptions<PushServiceOptions> pushServiceOptions, AppDbContext appDbContext, IValidator validator, IUserContext userContext)
        {
            _pushServiceOptions = pushServiceOptions;
            _client = new WebPush.WebPushClient();
            _dbContext = appDbContext;
            _validator = validator;
            _userContext = userContext;
        }

        public async Task<Results<Ok, ValidationProblem>> SubscribeAsync(PushSubscriptionForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));

            var formValidation = await _validator.ValidateAsync(form);

            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            try
            {
                await _lock.WaitAsync();

                var subscriptions = _dbContext.Set<PushSubscription>();
                var subscription = await subscriptions.FirstOrDefaultAsync(_ => _.P256Dh == form.P256Dh);

                if (subscription == null)
                {
                    subscription = new PushSubscription { P256Dh = form.P256Dh };
                    await subscriptions.AddAsync(subscription);
                }

                subscription.UserId = _userContext.UserId;
                subscription.UserAgent = _userContext.UserAgent;
                subscription.Endpoint = form.Endpoint;
                subscription.ExpirationTime = form.ExpirationTime;
                subscription.Auth = form.Auth;

                await _dbContext.SaveChangesAsync();

                return TypedResults.Ok();
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<Results<Ok, ValidationProblem, NotFound>> UnsubscribeAsync(PushSubscriptionForm form)
        {
            if (form is null) throw new ArgumentNullException(nameof(form));

            var formValidation = await _validator.ValidateAsync(form);

            if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

            try
            {
                await _lock.WaitAsync();

                var subscriptions = _dbContext.Set<PushSubscription>();
                var existingSubscription = await subscriptions.FirstOrDefaultAsync(_ => _.P256Dh == form.P256Dh);

                if (existingSubscription != null)
                {
                    subscriptions.Remove(existingSubscription);
                    await _dbContext.SaveChangesAsync();
                    return TypedResults.Ok();
                }

                return TypedResults.NotFound();
            }
            finally
            {
                _lock.Release();
            }
        }

        public Task<Results<Ok, ValidationProblem>> SendAsync(PushNotificationForm form, string userId)
        {
            return SendAsync(form, _dbContext.Set<PushSubscription>().Where(_ => _.UserId == userId));
        }

        public Task<Results<Ok, ValidationProblem>> SendAsync(PushNotificationForm form, string[] userIds)
        {
            return SendAsync(form, _dbContext.Set<PushSubscription>().Where(_ => userIds.Contains(_.UserId)));
        }

        public Task<Results<Ok, ValidationProblem>> SendAllExceptAsync(PushNotificationForm form, string[] userIds)
        {
            return SendAsync(form, _dbContext.Set<PushSubscription>().Where(_ => !userIds.Contains(_.UserId)));
        }

        public Task<Results<Ok, ValidationProblem>> SendAllAsync(PushNotificationForm notification)
        {
            return SendAsync(notification, _dbContext.Set<PushSubscription>());
        }

        private async Task<Results<Ok, ValidationProblem>> SendAsync(PushNotificationForm form, IQueryable<PushSubscription> query)
        {
            {
                if (form is null) throw new ArgumentNullException(nameof(form));

                var formValidation = await _validator.ValidateAsync(form);

                if (!formValidation.IsValid) return TypedResults.ValidationProblem(formValidation.Errors);

                try
                {
                    await _lock.WaitAsync();

                    var totalSubscriptions = await query.CountAsync();

                    var serializationOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

                    foreach (var (skip, take) in new Chunks(totalSubscriptions, 1000))
                    {
                        var subscriptions = await query.Skip(skip).Take(take).ToArrayAsync();

                        foreach (var subscription in subscriptions)
                        {
                            var payload = JsonSerializer.Serialize(form, serializationOptions);
                            await _client.SendNotificationAsync(new WebPush.PushSubscription(subscription.Endpoint, subscription.P256Dh, subscription.Auth), payload, _pushServiceOptions.Value.VapidDetails);
                        }
                    }

                    return TypedResults.Ok();
                }
                finally
                {
                    _lock.Release();
                }
            }
        }

        #region Implement IDisposable
        private bool disposed = false;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    // Free other state (managed objects).
                    _client.Dispose();
                    _lock.Dispose();
                }

                // Free your own state (unmanaged objects).
                // Set large fields to null.

                disposed = true;
            }
        }

        // Use C# destructor syntax for finalization code.
        ~PushService()
        {
            // Simply call Dispose(false).
            Dispose(false);
        }

        #endregion
    }

    public interface IPushService
    {
        Task<Results<Ok, ValidationProblem>> SubscribeAsync(PushSubscriptionForm form);

        Task<Results<Ok, ValidationProblem, NotFound>> UnsubscribeAsync(PushSubscriptionForm form);

        Task<Results<Ok, ValidationProblem>> SendAsync(PushNotificationForm form, string userId);

        Task<Results<Ok, ValidationProblem>> SendAsync(PushNotificationForm form, string[] userIds);

        Task<Results<Ok, ValidationProblem>> SendAllExceptAsync(PushNotificationForm form, string[] userIds);

        Task<Results<Ok, ValidationProblem>> SendAllAsync(PushNotificationForm notification);
    }

    public class PushServiceOptions
    {
        public WebPush.VapidDetails VapidDetails { get; set; } = new WebPush.VapidDetails();

    }

    public static class PushServiceExtensions
    {
        public static IServiceCollection AddPushService(this IServiceCollection services, Action<PushServiceOptions>? configure = null)
        {
            if (configure is not null) services.Configure(configure);
            services.AddScoped<IPushService, PushService>();
            return services;
        }
    }
}