﻿using FluentValidation;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace POwusu.Server.Models.Push
{
    /// <summary>
    /// <see href="https://notifications.spec.whatwg.org/#dictdef-notificationoptions">Notification API Standard</see>
    /// </summary>
    public class PushNotificationForm
    {

        [JsonPropertyName("title")]
        public string Title { get; set; } = null!;

        [JsonPropertyName("lang")]
        public string Lang { get; set; } = "en";

        [JsonPropertyName("body")]
        public string Body { get; set; } = null!;

        [JsonPropertyName("tag")]
        public string Tag { get; set; } = null!;

        [JsonPropertyName("image")]
        public string Image { get; set; } = null!;

        [JsonPropertyName("icon")]
        public string Icon { get; set; } = null!;

        [JsonPropertyName("badge")]
        public string Badge { get; set; } = null!;

        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.Now;

        [JsonPropertyName("requireInteraction")]
        public bool RequireInteraction { get; set; } = false;

        [JsonPropertyName("actions")]
        public List<PushNotificationAction> Actions { get; set; } = new List<PushNotificationAction>();
    }

    /// <summary>
    /// <see href="https://notifications.spec.whatwg.org/#dictdef-notificationaction">Notification API Standard</see>
    /// </summary>
    public class PushNotificationAction
    {
        [JsonPropertyName("action")]
        public string Action { get; set; } = null!;

        [JsonPropertyName("title")]
        public string Title { get; set; } = null!;
    }

    public class PushNotificationFormValidator : AbstractValidator<PushNotificationForm>
    {
        public PushNotificationFormValidator()
        {
            RuleFor(_ => _.Title).NotEmpty();
            RuleFor(_ => _.Body).NotEmpty();
        }
    }
}
